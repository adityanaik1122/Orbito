const healthRoutes = require('./healthRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const aiRoutes = require('./aiRoutes');
const { octoRoutes } = require('../octo-api');

function registerRoutes(app) {
  app.use('/api', healthRoutes);
  app.use('/api', itineraryRoutes);
  app.use('/api', aiRoutes);
  app.use('/api/octo', octoRoutes);
}

module.exports = {
  registerRoutes,
};
