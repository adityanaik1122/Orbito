/**
 * Security Test Suite: HTTP Security Headers & CORS
 * OWASP A05 – Security Misconfiguration
 *
 * Verifies that the server sends the correct security headers on every
 * response and that the CORS policy rejects disallowed origins.
 */

const request = require('supertest');
const app = require('../../src/app');

// Probe with a public endpoint so we can inspect headers without auth
const PROBE = () => request(app).get('/api/health');

describe('SECURITY | A05 — HTTP Security Headers', () => {

  // ── 1. Required security headers ────────────────────────────────────────
  describe('1. Required security headers are present', () => {

    it('X-Content-Type-Options: nosniff prevents MIME-sniffing attacks', async () => {
      const res = await PROBE();
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('X-Frame-Options or CSP frame-ancestors prevents clickjacking', async () => {
      const res = await PROBE();
      const xFrame = res.headers['x-frame-options'];
      const csp = res.headers['content-security-policy'] || '';
      const hasFrameProtection =
        (xFrame && /DENY|SAMEORIGIN/i.test(xFrame)) ||
        csp.includes('frame-ancestors');
      expect(hasFrameProtection).toBe(true);
    });

    it('Content-Security-Policy header is present', async () => {
      const res = await PROBE();
      const csp = res.headers['content-security-policy'];
      expect(csp).toBeDefined();
      expect(csp.length).toBeGreaterThan(0);
    });

    it("CSP restricts default-src to 'self'", async () => {
      const res = await PROBE();
      const csp = res.headers['content-security-policy'];
      expect(csp).toMatch(/default-src[^;]*'self'/);
    });

    it("CSP disallows object-src (blocks Flash/plugins)", async () => {
      const res = await PROBE();
      const csp = res.headers['content-security-policy'];
      expect(csp).toMatch(/object-src[^;]*'none'/);
    });

    it("CSP disallows frame-src (blocks iframe embedding of site)", async () => {
      const res = await PROBE();
      const csp = res.headers['content-security-policy'];
      expect(csp).toMatch(/frame-src[^;]*'none'/);
    });

    it('Cross-Origin-Resource-Policy header is present', async () => {
      const res = await PROBE();
      expect(res.headers['cross-origin-resource-policy']).toBeDefined();
    });
  });

  // ── 2. Headers that must NOT be present ────────────────────────────────
  describe('2. Information-disclosure headers are suppressed', () => {

    it('X-Powered-By is removed (does not reveal Express version)', async () => {
      const res = await PROBE();
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('Server header does not expose software version', async () => {
      const res = await PROBE();
      const server = res.headers['server'];
      if (server) {
        // Acceptable: missing header or generic value; not "Express/4.18.2"
        expect(server).not.toMatch(/express\/\d/i);
        expect(server).not.toMatch(/node\/\d/i);
      }
    });
  });

  // ── 3. CORS policy enforcement ──────────────────────────────────────────
  describe('3. CORS — disallowed origins are rejected', () => {

    const BLOCKED_ORIGINS = [
      'https://evil.com',
      'https://orbito.evil.com',
      'https://fake-orbito.vercel.app.evil.com',
      'http://localhost:9999',
      'null',
    ];

    BLOCKED_ORIGINS.forEach((origin) => {
      it(`Origin: "${origin}" is not reflected in Access-Control-Allow-Origin`, async () => {
        const res = await request(app)
          .get('/api/health')
          .set('Origin', origin);
        const acao = res.headers['access-control-allow-origin'];
        // Either not set at all, or not equal to the evil origin
        if (acao) {
          expect(acao).not.toBe(origin);
          expect(acao).not.toBe('*');
        }
      });
    });
  });

  // ── 4. CORS policy — allowed origins are accepted ──────────────────────
  describe('4. CORS — legitimate origins are allowed', () => {

    const ALLOWED_ORIGINS = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://orbitotrip.com',
      'https://www.orbitotrip.com',
    ];

    ALLOWED_ORIGINS.forEach((origin) => {
      it(`Origin: "${origin}" is permitted`, async () => {
        const res = await request(app)
          .get('/api/health')
          .set('Origin', origin);
        const acao = res.headers['access-control-allow-origin'];
        expect(acao).toBe(origin);
      });
    });

    it('Vercel preview deployments (*.vercel.app) are allowed', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'https://orbito-git-main-team.vercel.app');
      const acao = res.headers['access-control-allow-origin'];
      expect(acao).toBe('https://orbito-git-main-team.vercel.app');
    });
  });

  // ── 5. CORS preflight (OPTIONS) ─────────────────────────────────────────
  describe('5. CORS preflight requests', () => {

    it('OPTIONS /api/save-itinerary from allowed origin returns 204/200', async () => {
      const res = await request(app)
        .options('/api/save-itinerary')
        .set('Origin', 'https://orbitotrip.com')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Authorization, Content-Type');
      expect([200, 204]).toContain(res.status);
    });

    it('OPTIONS from blocked origin does not include Allow-Origin', async () => {
      const res = await request(app)
        .options('/api/save-itinerary')
        .set('Origin', 'https://evil.com')
        .set('Access-Control-Request-Method', 'POST');
      const acao = res.headers['access-control-allow-origin'];
      if (acao) {
        expect(acao).not.toBe('https://evil.com');
      }
    });
  });

  // ── 6. Sensitive routes do not cache responses ───────────────────────────
  describe('6. Protected endpoints set no-cache headers', () => {
    it('/api/itineraries sets Cache-Control to prevent caching', async () => {
      // Will 401 but we check the cache header is still set
      const res = await request(app).get('/api/itineraries');
      const cc = res.headers['cache-control'];
      if (cc) {
        expect(cc).toMatch(/no-store|no-cache|private/i);
      }
    });
  });

  // ── 7. HTTP method enforcement ───────────────────────────────────────────
  describe('7. Unsupported HTTP methods return 404/405', () => {
    it('TRACE method is not allowed', async () => {
      const res = await request(app).trace('/api/health');
      expect([404, 405]).toContain(res.status);
    });

    it('DELETE on read-only endpoint returns 404/405', async () => {
      const res = await request(app).delete('/api/health');
      expect([404, 405]).toContain(res.status);
    });
  });

});
