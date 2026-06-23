const healthRoutes = require('./healthRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const aiRoutes = require('./aiRoutes');
const tourRoutes = require('./tourRoutes');
const geocodingRoutes = require('./geocodingRoutes');
const geoRoutes = require('./geoRoutes');
const fxRoutes = require('./fxRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const affiliateRoutes = require('./affiliateRoutes');
const operatorRoutes = require('./operatorRoutes');
const paymentRoutes = require('./paymentRoutes');
const bookingRoutes = require('./bookingRoutes');
const adminRoutes = require('./adminRoutes');
const reviewRoutes = require('./reviewRoutes');
const jobRoutes = require('./jobRoutes');
const blogRoutes = require('./blogRoutes');
const tourGuideRoutes = require('./tourGuideRoutes');
const { octoRoutes } = require('../octo-api');

function registerRoutes(app) {
  app.use('/api', healthRoutes);
  app.use('/api', itineraryRoutes);
  app.use('/api', aiRoutes);
  app.use('/api', tourRoutes);
  app.use('/api', geocodingRoutes);
  app.use('/api', geoRoutes);
  app.use('/api', fxRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/affiliate', affiliateRoutes);
  app.use('/api/operator', operatorRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', reviewRoutes);
  app.use('/api', jobRoutes);
  app.use('/api', blogRoutes);
  app.use('/api/tour-guides', tourGuideRoutes);
  app.use('/api/octo', octoRoutes);
}

module.exports = {
  registerRoutes,
};
