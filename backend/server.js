const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Middleware to parse JSON
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const urlDB= `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}) `

const connection =mysql.createConnection(urlDB);

module.exports = connection;
// MySQL connection

{/**
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '10028mike.',
  database: 'atlascopco'
});
 */}
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Example route to fetch data
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM Myproducts', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.get('api/products', (req, res) => {
  const { minPrice, maxPrice } = req.query;
  // Query your database or data source with the provided price range
  // Return the results as JSON
 
  res.json({ minPrice, maxPrice });
});;

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
  const searchTerm = req.query.term;
  if (!searchTerm) {
      return res.status(400)
          .json(
              {
                  error: 'Search term is required'
              }
          );
  }

  const query = `
  SELECT * FROM products
  WHERE Description LIKE ? OR partnumber LIKE ?
`;

  // Use '%' to perform a partial match
  const searchValue = `%${searchTerm}%`;

  connection.query(query, [searchValue, searchValue],
      (err, results) => {
          if (err) {
              console
                  .error('Error executing search query:', err);
              return res.status(500)
                  .json(
                      {
                          error: 'Internal server error'
                      });
          }

          res.json(results);
      });
});

// POST route to place an order
app.post('/api/order', (req, res) => {
  const { formData,orderNumber } = req.body;

  if (!formData) {
    return res.status(400).json({ error: 'No form data provided' });
  }

  // Insert data into MySQL database
  const query = `INSERT INTO place_order (company_name, title, first_name, second_name, address1, address2, city, zip, phone,email,ordernumber) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
  connection.query(query, [
    formData.companyName,
    formData.title,
    formData.firstName,
    formData.secondName,
    formData.address1,
    formData.address2,
    formData.city,
    formData.zip,
    formData.phone,
    formData.email,
    orderNumber
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

app.listen(port,  "0.0.0.0",() => {
  console.log(`Server running on port ${port}`);
});



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
