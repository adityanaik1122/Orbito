const express = require('express');
const cors = require('cors');
const { registerRoutes } = require('./routes');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://orbitotrip.com',
    'https://www.orbitotrip.com',
    /\.vercel\.app$/
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

registerRoutes(app);

module.exports = app;
