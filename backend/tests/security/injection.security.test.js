/**
 * Security Test Suite: Injection & Input Validation
 * OWASP A03 – Injection (XSS, SQLi, NoSQLi, Command)
 * OWASP A04 – Insecure Design (mass assignment)
 *
 * Tests that all user-supplied input is safely validated and that
 * injection payloads are rejected or neutralised before processing.
 */

const request = require('supertest');
const app = require('../../src/app');

// ── Common attack payloads ───────────────────────────────────────────────────

// Payloads that contain angle-bracket or control chars — Joi pattern blocks these at 400
const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '"><img src=x onerror=alert(1)>',
  '<svg onload=alert(document.cookie)>',
  '<iframe src="javascript:alert(1)">',
];

const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "' OR 1=1--",
  "'; DROP TABLE itineraries; --",
  "' UNION SELECT * FROM profiles--",
  "admin'--",
  "1; SELECT SLEEP(5)--",
];

const PATH_TRAVERSAL_PAYLOADS = [
  '../../../etc/passwd',
  '....//....//....//etc/passwd',
];

// ── Helper ──────────────────────────────────────────────────────────────────

async function postPublic(path, body) {
  return request(app)
    .post(path)
    .set('Content-Type', 'application/json')
    .send(body);
}

// ────────────────────────────────────────────────────────────────────────────

describe('SECURITY | A03 — Injection & Input Validation', () => {

  // ── 1. XSS payloads rejected by validation middleware ──────────────────
  describe('1. XSS payloads in /api/generate-itinerary are rejected by Joi', () => {
    XSS_PAYLOADS.forEach((payload) => {
      it(`Destination: "${payload.slice(0, 50)}"`, async () => {
        const res = await postPublic('/api/generate-itinerary', {
          destination: payload,
          startDate: '2027-01-01',
          endDate: '2027-01-05',
        });
        // Validation middleware rejects these with 400 — they must NOT reach the AI layer
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation Error');
      });
    });
  });

  // ── 2. XSS in AI activity suggestions ──────────────────────────────────
  describe('2. XSS payloads in /api/suggest-activities do not execute', () => {
    XSS_PAYLOADS.slice(0, 3).forEach((payload) => {
      it(`Prompt: "${payload.slice(0, 50)}"`, async () => {
        const res = await postPublic('/api/suggest-activities', {
          prompt: payload,
          destination: 'London',
        });
        if (res.status === 200) {
          const bodyStr = JSON.stringify(res.body);
          expect(bodyStr).not.toMatch(/<script>/i);
          expect(bodyStr).not.toMatch(/onerror=/i);
        }
        // Any status is OK here as long as it is not a server crash
        expect(res.status).not.toBe(500);
      });
    });
  });

  // ── 3. SQL injection in query parameters ───────────────────────────────
  describe('3. SQL injection in query params → no 500 or DB error', () => {
    SQL_INJECTION_PAYLOADS.forEach((payload) => {
      it(`Tours query: "${payload.slice(0, 50)}"`, async () => {
        const res = await request(app)
          .get('/api/tours')
          .query({ destination: payload, category: payload });
        expect(res.status).not.toBe(500);
        if (res.status === 200) {
          const bodyStr = JSON.stringify(res.body);
          expect(bodyStr).not.toMatch(/syntax error/i);
          expect(bodyStr).not.toMatch(/pg_query/i);
          expect(bodyStr).not.toMatch(/sql state/i);
        }
      });
    });
  });

  // ── 4. Oversized body payloads ─────────────────────────────────────────
  describe('4. Oversized payloads are rejected', () => {
    it('Body larger than 10 MB limit → 413/400', async () => {
      const huge = 'x'.repeat(11 * 1024 * 1024);
      const res = await request(app)
        .post('/api/generate-itinerary')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ destination: huge }));
      expect([400, 413]).toContain(res.status);
    }, 15000);

    it('Preference field over 500 chars → rejected by Joi', async () => {
      const res = await postPublic('/api/generate-itinerary', {
        destination: 'London',
        startDate: '2027-06-01',
        endDate: '2027-06-05',
        preferences: 'A'.repeat(10000),
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  // ── 5. Null bytes and control characters are rejected ──────────────────
  describe('5. Null bytes and control characters rejected by validation', () => {
    // Use Unicode escapes so the file is saved cleanly
    const NULL_BYTE = String.fromCharCode(0);
    const CR = String.fromCharCode(13);
    const LF = String.fromCharCode(10);
    const CTRL = String.fromCharCode(1) + String.fromCharCode(2);

    const CONTROL_CASES = [
      { label: 'null byte injection',   value: 'London' + NULL_BYTE + '; DROP TABLE users' },
      { label: 'CRLF header injection', value: 'Paris' + CR + LF + 'X-Injected: evil' },
      { label: 'bare control chars',    value: CTRL },
    ];

    CONTROL_CASES.forEach(({ label, value }) => {
      it(label, async () => {
        const res = await postPublic('/api/generate-itinerary', {
          destination: value,
          startDate: '2027-01-01',
          endDate: '2027-01-03',
        });
        // Joi pattern rejects control chars — must be 400, never 500
        expect(res.status).toBe(400);
      });
    });
  });

  // ── 6. Path traversal in URL segments ──────────────────────────────────
  describe('6. Path traversal in URL params → 400/404, never file content', () => {
    PATH_TRAVERSAL_PAYLOADS.forEach((payload) => {
      it(`Tour ID: "${payload.slice(0, 50)}"`, async () => {
        const res = await request(app).get(`/api/tours/${encodeURIComponent(payload)}`);
        expect([400, 404]).toContain(res.status);
        const bodyStr = JSON.stringify(res.body);
        expect(bodyStr).not.toMatch(/root:/);
      });
    });
  });

  // ── 7. Mass assignment — cannot set privileged fields via body ──────────
  describe('7. Mass assignment — role escalation via request body', () => {
    it('Cannot set role=admin via save-itinerary body (blocked at auth layer)', async () => {
      const res = await postPublic('/api/save-itinerary', {
        title: 'Test',
        destination: 'London',
        startDate: '2027-01-01',
        endDate: '2027-01-03',
        days: [],
        role: 'admin',
        user_id: '00000000-0000-0000-0000-000000000000',
      });
      // Protected route → 401 without valid session.
      // Even if authenticated, role/user_id from body are ignored (comes from req.user).
      expect(res.status).toBe(401);
    });
  });

  // ── 8. Content-Type enforcement ─────────────────────────────────────────
  describe('8. Non-JSON Content-Type to JSON endpoints does not crash server', () => {
    it('Sending XML does not return 500', async () => {
      const res = await request(app)
        .post('/api/generate-itinerary')
        .set('Content-Type', 'application/xml')
        .send('<destination>London</destination>');
      expect(res.status).not.toBe(500);
    });
  });

});
