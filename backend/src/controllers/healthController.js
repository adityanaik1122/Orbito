function getHealth(req, res) {
  res.json({ status: 'healthy', gemini: !!process.env.GEMINI_API_KEY });
}

module.exports = {
  getHealth,
};
