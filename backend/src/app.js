const express = require('express');
const cors = require('cors');
const { registerRoutes } = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

module.exports = app;
