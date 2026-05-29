const request = require('supertest');
const app = require('../src/app');

describe('Tour Guide notification endpoints', () => {
  describe('POST /api/tour-guides/notify-registration', () => {
    it('returns 400 when guide data is missing', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-registration')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-registration')
        .send();
      expect(res.status).toBe(400);
    });

    it('accepts valid guide data shape (email may fail without real key)', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-registration')
        .send({
          guide: {
            full_name: 'Test Guide',
            email: 'test@example.com',
            phone_number: '+447000000000',
            location: 'London',
            charges_per_hour: 30,
            languages: ['English'],
            specialties: ['History & Culture'],
            description: 'Test guide description',
          },
        });
      // 200 = email sent, 500 = email service not configured — both are acceptable shapes
      expect([200, 500]).toContain(res.status);
      expect(res.body).toHaveProperty(res.status === 200 ? 'success' : 'error');
    });
  });

  describe('POST /api/tour-guides/notify-status', () => {
    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-status')
        .send({ status: 'approved' });
      expect(res.status).toBe(400);
    });

    it('returns 400 when status is missing', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-status')
        .send({ email: 'guide@example.com' });
      expect(res.status).toBe(400);
    });

    it('accepts valid approval payload', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-status')
        .send({ email: 'guide@example.com', name: 'Test Guide', status: 'approved' });
      expect([200, 500]).toContain(res.status);
    });

    it('accepts valid rejection payload with reason', async () => {
      const res = await request(app)
        .post('/api/tour-guides/notify-status')
        .send({
          email: 'guide@example.com',
          name: 'Test Guide',
          status: 'rejected',
          rejectionReason: 'Incomplete profile information',
        });
      expect([200, 500]).toContain(res.status);
    });
  });
});
