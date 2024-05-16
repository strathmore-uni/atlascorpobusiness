const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors'); 
const port = 3001;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
    methods: ['GET', 'POST'], // Allow only specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
  }));
// MySQL connection

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '10028mike.',
  database: 'atlascopco'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Example route to fetch data
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.get('/api/servkit', (req, res) => {
  connection.query('SELECT * FROM servkit', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});



app.get('/api/search', (req, res) => {
    const { query } = req.query;
    const sql = `SELECT * FROM servkit WHERE Description LIKE '%${query}%'`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
