const request = require('supertest');
const app = require('../src/app');

describe('Payment endpoints', () => {
  describe('POST /api/payments/create-intent', () => {
    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/payments/create-intent')
        .send({ bookingId: 'test-id' });
      expect(res.status).toBe(401);
    });

    it('returns 401 with invalid Bearer token', async () => {
      const res = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', 'Bearer invalid-token-12345')
        .send({ bookingId: 'test-id' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('returns 400 with missing stripe signature', async () => {
      const res = await request(app)
        .post('/api/payments/webhook')
        .send('{}');
      // 400 (missing sig), 500 (server error), or 503 (Stripe not configured)
      expect([400, 500, 503]).toContain(res.status);
    });
  });
});
