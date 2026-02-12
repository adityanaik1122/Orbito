const healthRoutes = require('./healthRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const aiRoutes = require('./aiRoutes');
const tourRoutes = require('./tourRoutes');
const { octoRoutes } = require('../octo-api');

function registerRoutes(app) {
  app.use('/api', healthRoutes);
  app.use('/api', itineraryRoutes);
  app.use('/api', aiRoutes);
  app.use('/api', tourRoutes);
  app.use('/api/octo', octoRoutes);
}

module.exports = {
  registerRoutes,
};
