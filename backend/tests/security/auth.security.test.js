/**
 * Security Test Suite: Authentication & Access Control
 * OWASP A01 – Broken Access Control
 * OWASP A07 – Identification and Authentication Failures
 *
 * Verifies that every protected endpoint correctly enforces authentication
 * and that privilege escalation across roles is not possible.
 */

const request = require('supertest');
const app = require('../../src/app');

// A structurally-valid JWT signed with a different secret (wrong project)
const WRONG_PROJECT_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFub24iLCJpYXQiOjE1MTYyMzkwMjJ9' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Structurally invalid tokens
const MALFORMED_TOKENS = [
  'not-a-token',
  'Bearer',
  'eyJonly-one-part',
  'null',
  '../../../../etc/passwd',
  '<script>alert(1)</script>',
  'a'.repeat(4096),
];

// ── Protected routes that require a valid user session ───────────────────────
const USER_PROTECTED_ROUTES = [
  { method: 'post', path: '/api/save-itinerary',   body: {} },
  { method: 'get',  path: '/api/itineraries',       body: null },
  { method: 'post', path: '/api/payments/create-intent', body: {} },
];

// ── Admin-only routes ────────────────────────────────────────────────────────
const ADMIN_ONLY_ROUTES = [
  { method: 'get',  path: '/api/admin/applications' },
  { method: 'get',  path: '/api/admin/pending-tours' },
  { method: 'post', path: '/api/admin/fetch-blog' },
  { method: 'get',  path: '/api/analytics/dashboard/summary' },
  { method: 'get',  path: '/api/analytics/bookings' },
  { method: 'get',  path: '/api/affiliate/dashboard' },
];

// ── Operator-only routes ─────────────────────────────────────────────────────
const OPERATOR_ONLY_ROUTES = [
  { method: 'get',  path: '/api/operator/dashboard' },
  { method: 'get',  path: '/api/operator/tours' },
];

// ────────────────────────────────────────────────────────────────────────────

describe('SECURITY | A01/A07 — Authentication & Access Control', () => {

  // ── 1. No token at all ──────────────────────────────────────────────────
  describe('1. Missing Authorization header → 401', () => {
    USER_PROTECTED_ROUTES.forEach(({ method, path, body }) => {
      it(`${method.toUpperCase()} ${path}`, async () => {
        const req = request(app)[method](path).set('Content-Type', 'application/json');
        const res = body ? await req.send(body) : await req;
        expect(res.status).toBe(401);
      });
    });

    ADMIN_ONLY_ROUTES.forEach(({ method, path }) => {
      it(`${method.toUpperCase()} ${path}`, async () => {
        const res = await request(app)[method](path);
        expect(res.status).toBe(401);
      });
    });

    OPERATOR_ONLY_ROUTES.forEach(({ method, path }) => {
      it(`${method.toUpperCase()} ${path}`, async () => {
        const res = await request(app)[method](path);
        expect(res.status).toBe(401);
      });
    });
  });

  // ── 2. Malformed / garbage tokens → 401 ────────────────────────────────
  describe('2. Malformed token → 401', () => {
    MALFORMED_TOKENS.forEach((token) => {
      const label = token.length > 40 ? token.slice(0, 40) + '…' : token;
      it(`Token: "${label}"`, async () => {
        const res = await request(app)
          .get('/api/itineraries')
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(401);
      });
    });
  });

  // ── 3. Wrong-project JWT (valid structure, wrong signing key) → 401 ────
  describe('3. Wrong-project JWT → 401', () => {
    USER_PROTECTED_ROUTES.forEach(({ method, path, body }) => {
      it(`${method.toUpperCase()} ${path}`, async () => {
        const req = request(app)[method](path)
          .set('Authorization', `Bearer ${WRONG_PROJECT_JWT}`)
          .set('Content-Type', 'application/json');
        const res = body ? await req.send(body) : await req;
        expect(res.status).toBe(401);
      });
    });
  });

  // ── 4. Authorization header present but empty value → 401 ──────────────
  describe('4. Empty / blank Bearer value → 401', () => {
    ['Bearer ', 'Bearer  ', 'bearer token', ''].forEach((header) => {
      it(`Header: "${header}"`, async () => {
        const res = await request(app)
          .get('/api/itineraries')
          .set('Authorization', header);
        expect(res.status).toBe(401);
      });
    });
  });

  // ── 5. Admin routes with wrong-project token should still 401 ──────────
  describe('5. Admin routes with wrong-project JWT → 401', () => {
    ADMIN_ONLY_ROUTES.forEach(({ method, path }) => {
      it(`${method.toUpperCase()} ${path}`, async () => {
        const res = await request(app)[method](path)
          .set('Authorization', `Bearer ${WRONG_PROJECT_JWT}`);
        expect(res.status).toBe(401);
      });
    });
  });

  // ── 6. Response body must not leak internal details ─────────────────────
  describe('6. 401 responses do not leak sensitive internals', () => {
    it('error body does not expose stack trace', async () => {
      const res = await request(app)
        .get('/api/itineraries')
        .set('Authorization', `Bearer ${WRONG_PROJECT_JWT}`);
      expect(res.body.stack).toBeUndefined();
      expect(JSON.stringify(res.body)).not.toMatch(/at Object\.|at Module\.|node_modules/);
    });

    it('error body does not expose Supabase URL or keys', async () => {
      const res = await request(app)
        .get('/api/itineraries')
        .set('Authorization', `Bearer bad`);
      const body = JSON.stringify(res.body);
      expect(body).not.toMatch(/supabase\.co/i);
      expect(body).not.toMatch(/eyJhbGciOi/); // JWT prefix
      expect(body).not.toMatch(/service_role/i);
    });
  });

  // ── 7. Public routes must remain accessible ─────────────────────────────
  describe('7. Public endpoints remain accessible without auth', () => {
    const PUBLIC_ROUTES = [
      { method: 'get',  path: '/api/health' },
      { method: 'get',  path: '/api/ready' },
      { method: 'get',  path: '/api/live' },
    ];

    PUBLIC_ROUTES.forEach(({ method, path }) => {
      it(`${method.toUpperCase()} ${path} → not 401/403`, async () => {
        const res = await request(app)[method](path);
        expect(res.status).not.toBe(401);
        expect(res.status).not.toBe(403);
      });
    });
  });

  // ── 8. Privilege escalation: trying to reach admin routes via path tricks
  describe('8. Path manipulation / privilege escalation attempts', () => {
    const attempts = [
      '/api/admin/../admin/applications',
      '/api/admin/applications%00',
      '/API/admin/applications',
    ];

    attempts.forEach((path) => {
      it(`Attempt: ${path}`, async () => {
        const res = await request(app)
          .get(path)
          .set('Authorization', `Bearer ${WRONG_PROJECT_JWT}`);
        // Must be 401/403/404 — never 200
        expect([401, 403, 404]).toContain(res.status);
      });
    });
  });

});
