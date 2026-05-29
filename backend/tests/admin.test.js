const request = require('supertest');
const app = require('../src/app');

describe('Admin endpoints (auth guard)', () => {
  const protectedRoutes = [
    { method: 'get',  path: '/api/admin/bookings' },
    { method: 'get',  path: '/api/admin/operators' },
    { method: 'get',  path: '/api/admin/tour-guides' },
  ];

  protectedRoutes.forEach(({ method, path }) => {
    it(`${method.toUpperCase()} ${path} → 401 without token`, async () => {
      const res = await request(app)[method](path);
      expect(res.status).toBe(401);
    });
  });

  it('GET /api/admin/bookings → 401 with fake token', async () => {
    const res = await request(app)
      .get('/api/admin/bookings')
      .set('Authorization', 'Bearer fake-token');
    expect(res.status).toBe(401);
  });
});
