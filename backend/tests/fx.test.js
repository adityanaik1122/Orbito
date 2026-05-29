const request = require('supertest');
const app = require('../src/app');

describe('FX rates endpoint', () => {
  it('GET /api/fx returns 200', async () => {
    const res = await request(app).get('/api/fx');
    expect(res.status).toBe(200);
  });

  it('GET /api/fx returns rates object', async () => {
    const res = await request(app).get('/api/fx');
    expect(res.body).toHaveProperty('rates');
    // rates may be null if external API is down, but key must exist
    if (res.body.rates) {
      expect(typeof res.body.rates).toBe('object');
      // GBP and EUR should always be present
      expect(res.body.rates).toHaveProperty('GBP');
      expect(res.body.rates).toHaveProperty('EUR');
    }
  });

  it('GET /api/fx returns cached flag', async () => {
    const res = await request(app).get('/api/fx');
    expect(res.body).toHaveProperty('cached');
    expect(typeof res.body.cached).toBe('boolean');
  });
});
