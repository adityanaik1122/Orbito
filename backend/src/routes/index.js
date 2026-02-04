const healthRoutes = require('./healthRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const aiRoutes = require('./aiRoutes');

function registerRoutes(app) {
  app.use('/api', healthRoutes);
  app.use('/api', itineraryRoutes);
  app.use('/api', aiRoutes);
}

module.exports = {
  registerRoutes,
};
