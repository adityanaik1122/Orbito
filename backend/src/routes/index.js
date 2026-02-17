const healthRoutes = require('./healthRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const aiRoutes = require('./aiRoutes');
const tourRoutes = require('./tourRoutes');
const geocodingRoutes = require('./geocodingRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const { octoRoutes } = require('../octo-api');

function registerRoutes(app) {
  app.use('/api', healthRoutes);
  app.use('/api', itineraryRoutes);
  app.use('/api', aiRoutes);
  app.use('/api', tourRoutes);
  app.use('/api', geocodingRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/octo', octoRoutes);
}

module.exports = {
  registerRoutes,
};
