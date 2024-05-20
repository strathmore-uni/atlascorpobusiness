const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
    methods: ['GET', 'POST'], // Allow only specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
}));

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
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

// POST route to place an order
app.post('/api/order', (req, res) => {
  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ error: 'No form data provided' });
  }

  // Insert data into MySQL database
  const query = `INSERT INTO place_order (company_name, title, first_name, second_name, address1, address2, city, zip, phone) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(query, [
    formData.companyName,
    formData.title,
    formData.firstName,
    formData.secondName,
    formData.address1,
    formData.address2,
    formData.city,
    formData.zip,
    formData.phone
  ], (err, results) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).send(err);
    } else {
      res.status(201).json({ message: 'Order placed successfully', orderId: results.insertId });
    }
  });
});

// Define the port
const port = process.env.PORT || 3001;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Test route to verify connection
app.get('/api/test-connection', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Database connected', solution: results[0].solution });
  });
});
