const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// MCP API endpoint
app.get('/api/mcp/status', (req, res) => {
  res.json({
    status: 'MCP Server Active',
    protocol: 'Model Context Protocol',
    version: '1.0.0',
    capabilities: [
      'AI-driven development',
      'Context management',
      'Tool integration',
      'Real-time assistance'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI-Assisted Web UI Starter running on http://localhost:${PORT}`);
  console.log('📡 MCP Server integration enabled');
});

module.exports = app;