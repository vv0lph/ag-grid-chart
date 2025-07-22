
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const DB_FILE = './db.json';

// Helper function to read from the database
const readDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    return {};
  }
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to the database
const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API to get the current state
app.get('/api/state', (req, res) => {
  const db = readDb();
  res.json(db);
});

// API to save the state
app.post('/api/state', (req, res) => {
  const { gridState, chartState, clickHistory, chartCustomizations } = req.body;
  const db = readDb();
  db.gridState = gridState;
  db.chartState = chartState;
  db.clickHistory = clickHistory;
  db.chartCustomizations = chartCustomizations;
  writeDb(db);
  res.json({ message: 'State saved successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
