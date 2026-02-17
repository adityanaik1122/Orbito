const express = require('express');
const cors = require('cors');
const { registerRoutes } = require('./routes');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://orbitotrip.com',
      'https://www.orbitotrip.com',
    ];
    
    // Allow Vercel deployments and localhost
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

registerRoutes(app);

module.exports = app;
