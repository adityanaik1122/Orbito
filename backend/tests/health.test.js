const request = require('supertest');
const app = require('../src/app');

describe('Health endpoints', () => {
  it('GET /api/health returns 200 with healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(['healthy', 'degraded']).toContain(res.body.status);
  });

  it('GET /api/health includes timestamp and uptime', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('GET /api/ready returns 200', async () => {
    const res = await request(app).get('/api/ready');
    expect(res.status).toBe(200);
  });

  it('GET /api/live returns 200', async () => {
    const res = await request(app).get('/api/live');
    expect(res.status).toBe(200);
  });
});
