const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path')
const https = require('https');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(cors)
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'client-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'client-cert.pem')),
  ca: fs.readFileSync(path.join(__dirname, 'cert', 'server-ca.pem')),
};
salt=10;

let pool;

try {
  pool = mysql.createPool({
    host: process.env.INSTANCE_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    ssl: sslOptions,
    
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000,
    queueLimit: 0,
  });
  
 
} catch (error) {
  console.error('Error creating database connection pool:', error);
  process.exit(1); // Exit the process or handle the error as appropriate
}


{/** 
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'atlascorpobusiness/build')));
socketPath: process.env.DB_SOCKET_PATH,
*/}
app.get('/', (req, res) => {
  res.send('Hello World!');
});
const httpsServer = https.createServer({
  ...sslOptions,
  // Set the hostname to your domain name (e.g., example.com)
  servername: 'https://localhost:3001',
}, app);

if (process.env.NODE_ENV === 'production') {
  pool.socketPath = process.env.DB_SOCKET_PATH;
} else {
  pool.host = process.env.INSTANCE_HOST;
 
}

const validateInput = (req, res, next) => {
  const schema = Joi.object({
    companyName: Joi.string().required(),
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    secondName: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confpassword: Joi.string().valid(Joi.ref('password')).required(), // Added for validation
    country: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.error('Validation error:', error.details);
    return res.status(400).json({ error: error.details });
  }
  next();
};

app.post('/api/register', validateInput, async (req, res) => {
  const {
    companyName,
    title,
    firstName,
    secondName,
    address1,
    address2,
    city,
    zip,
    phone,
    email,
    password,
    country
  } = req.body;

  const normalizedEmail = email.toLowerCase(); // Normalize the email address to lowercase

  try {
    const checkEmailQuery = 'SELECT email FROM registration WHERE LOWER(email) = LOWER(?)';
    const [result] = await pool.query(checkEmailQuery, [normalizedEmail]);

    if (result.length > 0) {
      console.error('Email already exists:', normalizedEmail);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const insertQuery = `
      INSERT INTO registration (
        companyName, title, firstName, secondName, address1, address2, city, zip, phone, email, password, country
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const values = [
      companyName,
      title,
      firstName,
      secondName,
      address1,
      address2,
      city,
      zip,
      phone,
      normalizedEmail,
      password,
      country
    ];

    await pool.query(insertQuery, values);

   
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//await sendVerificationEmail(email, firstName, verificationToken);

app.get('/verify-email', (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const query = 'UPDATE registration SET is_verified = 1 WHERE email = ?';

  pool.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error updating email verification:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    return res.status(200).json({ message: 'Email verified successfully' });
  });
});




const secretKey = 'waweru';

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM registration WHERE email = ? AND password = ?";
    pool.query(sql, [req.body.email, req.body.password])
        .then(([users]) => {
            if (users.length > 0) {
                const user = users[0];
                const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
                return res.json({ message: "Login Successful", token });
            } else {
                return res.status(401).json({ message: "Login Failed" });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        });
});

app.post('/verifyToken', (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.json({ email: decoded.email });
    });
});
  

app.get('/api/myproducts', async (req, res) => {
    const userEmail = req.query.email;
  
    if (!userEmail) {
      console.error('No user email provided');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
     
      const countryCodeQuery = 'SELECT country FROM registration WHERE email =?';
      const [countryCodeResult] = await pool.query(countryCodeQuery, [userEmail]);
  
      if (countryCodeResult.length === 0) {
        console.error(`User not found with email: ${userEmail}`);
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userCountryCode = countryCodeResult[0].country;
      console.log(`User country code: ${userCountryCode}`);
  
     
      const productsQuery = `
        SELECT p.id, p.partnumber, p.Description, p.image,p.thumb1,p.thumb2, pp.price AS Price, s.quantity
        FROM fulldata p
        JOIN stock s ON p.id = s.product_id
        JOIN atlascopcoproduct_prices pp ON p.id = pp.product_id
        WHERE pp.country_code =?
      `;
      const [products] = await pool.query(productsQuery, [userCountryCode]);
  
      console.log(`Fetched ${products.length} products`);
      res.json(products);
     
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/api/user', async (req, res) => {
    const userEmail = req.query.email;
  
    if (!userEmail) {
      console.error('No user email provided');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const query = `
        SELECT email, companyName, title, firstName, secondName, address1, address2, city, zip, phone, country
        FROM registration
        WHERE email = ?
      `;
      const [userResults] = await pool.query(query, [userEmail]);
  
      if (userResults.length === 0) {
        console.error(`User not found with email: ${userEmail}`);
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userData = userResults[0];
      res.json({
        email: userData.email,
        companyName: userData.companyName,
        title: userData.title,
        firstName: userData.firstName,
        secondName: userData.secondName,
        address1: userData.address1,
        address2: userData.address2,
        city: userData.city,
        zip: userData.zip,
        phone: userData.phone,
        country: userData.country
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/update', async (req, res) => {
    const { email, companyName, title, firstName, secondName, address1, address2, city, zip, phone, country } = req.body;
  
   
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      
      const query = `
        UPDATE registration
        SET companyName = ?, title = ?, firstName = ?, secondName = ?, address1 = ?,
            address2 = ?, city = ?, zip = ?, phone = ?, country = ?
        WHERE email = ?
      `;
      const values = [companyName, title, firstName, secondName, address1, address2, city, zip, phone, country, email];
  
      
      const [result] = await pool.query(query, values);
  
      
      if (result.affectedRows > 0) {
        res.json({ message: 'User details updated successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
 
  app.get('/api/products/:category?', async (req, res) => {
    const category = req.params.category;
    const userEmail = req.query.email;
  
    if (!userEmail) {
      console.error('No user email provided');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      
      const countryCodeQuery = 'SELECT country FROM registration WHERE email =?';
      const [countryCodeResult] = await pool.query(countryCodeQuery, [userEmail]);
  
      if (countryCodeResult.length === 0) {
        console.error(`User not found with email: ${userEmail}`);
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userCountryCode = countryCodeResult[0].country;
      console.log(`User country code: ${userCountryCode}`);
  
      let query;
      let queryParams = [userCountryCode];
  
      if (category) {
        query = `
          SELECT p.id, p.partnumber, p.Description, p.image,p.thumb1,p.thumb2, pp.price AS Price, s.quantity
          FROM fulldata p
          JOIN stock s ON p.id = s.product_id
          JOIN atlascopcoproduct_prices pp ON p.id = pp.product_id
          WHERE (p.mainCategory = ? OR p.subCategory = ?) AND pp.country_code =?
        `;
        queryParams = [category, category, userCountryCode];
      } else {
        query = `
          SELECT p.id, p.partnumber, p.Description, p.image,p.thumb1,p.thumb2, pp.price AS Price, s.quantity
          FROM fulldata p
          JOIN stock s ON p.id = s.product_id
          JOIN atlascopcoproduct_prices pp ON p.id = pp.product_id
          WHERE pp.country_code =?
        `;
      }
  
      const [results] = await pool.query(query, queryParams);
      console.log(`Fetched ${results.length} products`);
      res.json(results);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

 
app.post('/api/order', async (req, res) => {
  const { formData, cartItems, orderNumber } = req.body;
  if (!formData || !cartItems) {
    return res.status(400).json({ error: 'No form data or cart items provided' });
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [orderResult] = await connection.query(
      `INSERT INTO placing_orders (company_name, title, first_name, second_name, address1, address2, city, zip, phone, email, ordernumber) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );
    const orderId = orderResult.insertId;
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, description, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.Description, item.quantity, item.Price]
      );
    }
    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    await connection.rollback();
    console.error('Error placing order:', error);
    res.status(500).send(error);
  } finally {
    connection.release();
  }
});

app.get('/api/orders', async (req, res) => {
  const userId = req.query.userId;
  const query = 'SELECT * FROM orders WHERE userId = ? ORDER BY orderDate DESC';

  try {
    const [results] = await pool.query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
});
app.get('/api/orders/history', async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    // Fetch orders and their items from database based on userEmail
    const [orders] = await pool.query(
      `SELECT placing_orders.*, GROUP_CONCAT(JSON_OBJECT('description', oi.description, 'quantity', oi.quantity, 'price', oi.price)) as items
       FROM placing_orders
       LEFT JOIN order_items oi ON placing_orders.id = oi.order_id
       WHERE placing_orders.email = ?
       GROUP BY placing_orders.id`,
      [userEmail]
    );

    // If no orders found, return an empty array
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }

    // Parse items JSON and format response
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }));

    // Respond with the fetched orders
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});



app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.term || '';
  const category = req.query.category || '';
  const userEmail = req.query.email;

  if (!userEmail) {
    console.error('No user email provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch the country code based on user's email from the registration table
    const countryCodeQuery = 'SELECT country FROM registration WHERE email = ?';
    const [countryCodeResult] = await pool.query(countryCodeQuery, [userEmail]);

    if (countryCodeResult.length === 0) {
      console.error(`User not found with email: ${userEmail}`);
      return res.status(404).json({ error: 'User not found' });
    }

    const userCountryCode = countryCodeResult[0].country;
    console.log(`User country code: ${userCountryCode}`);

    let query = `
      SELECT p.id, p.partnumber, p.Description, p.image,p.thumb1,p.thumb2, pp.price AS Price, s.quantity, p.subCategory AS category
      FROM fulldata p
      JOIN stock s ON p.id = s.product_id
      JOIN atlascopcoproduct_prices pp ON p.id = pp.product_id
      WHERE pp.country_code = ? AND (p.partnumber LIKE ? OR p.Description LIKE ? OR p.mainCategory LIKE ?)
    `;

    const searchValue = `%${searchTerm}%`;
    const queryParams = [userCountryCode, searchValue, searchValue, searchValue];

    if (category) {
      query += ' AND (p.mainCategory = ? OR p.subCategory = ?)';
      queryParams.push(category, category);
    }

    const [results] = await pool.query(query, queryParams);
    res.json(results);
  } catch (err) {
    console.error('Error executing search query:', err);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/api/products/range/:category/:min/:max', async (req, res) => {
  const category = req.params.category;
  const minPrice = parseFloat(req.params.min); // Parse min price as float
  const maxPrice = parseFloat(req.params.max); // Parse max price as float

  let query;
  let queryParams = [minPrice, maxPrice, category, category]; // Update queryParams order

  query = `
    SELECT p.id, p.partnumber, p.Description, p.Price, s.quantity
    FROM fulldata p
    JOIN stock s ON p.id = s.product_id
    WHERE (p.mainCategory = ? OR p.subCategory = ?) AND p.Price >= ? AND p.Price <= ?
  `;

  try {
    const [results] = await pool.query(query, queryParams);
    res.json(results);
  } catch (err) {
    console.error('Error fetching products by price range and category:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/products/partnumber/:partnumber', async (req, res) => {
  const { partnumber } = req.params;
  const userEmail = req.query.email; // Retrieve email from query parameters

  try {
    // Validate userEmail if required
    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Fetch product details along with price for the user's country
    const query = `
      SELECT p.partnumber, p.Description,p.image, pp.price AS Price
      FROM fulldata p
      JOIN atlascopcoproduct_prices pp ON p.id = pp.product_id
      JOIN registration r ON pp.country_code = r.country
      WHERE p.partnumber = ? AND r.email = ?
    `;
    const [results] = await pool.query(query, [partnumber, userEmail]);

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Invoice Ninja Integration
app.post('/api/send-invoice', async (req, res) => {
  const { client, items, orderNumber, total } = req.body;
  
  const INVOICE_NINJA_URL = 'http://localhost:8000/api/v1';
  const API_TOKEN = 'lplYeuCJfmmcWfhPdJ9BHA1GcBuU7aBQHmY4K1xBpxU2RhB3Tr8y0VcZL3QHNDFB';

  try {
    // 1. Create or get client
    let clientId;
    try {
      // Try to find existing client by email
      const searchResponse = await fetch(`${INVOICE_NINJA_URL}/clients?email=${client.email}`, {
        headers: { 
          'X-API-Token': API_TOKEN,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const searchData = await searchResponse.json();
      
      if (searchData.data && searchData.data.length > 0) {
        clientId = searchData.data[0].id;
        console.log('Found existing client:', clientId);
      } else {
        // Create new client
        const createClientResponse = await fetch(`${INVOICE_NINJA_URL}/clients`, {
          method: 'POST',
          headers: { 
            'X-API-Token': API_TOKEN,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            address1: client.address1 || '',
            address2: client.address2 || '',
            city: client.city || '',
            state: client.state || '',
            postal_code: client.zip || '',
            country_id: client.country || 1
          })
        });
        
        const createClientData = await createClientResponse.json();
        clientId = createClientData.data.id;
        console.log('Created new client:', clientId);
      }
    } catch (clientError) {
      console.error('Error handling client:', clientError);
      return res.status(500).json({ error: 'Failed to create/find client' });
    }

    // 2. Create invoice
    const lineItems = items.map(item => ({
      product_key: item.product_key || item.name,
      notes: item.notes || item.description || '',
      cost: parseFloat(item.cost || item.price),
      qty: parseInt(item.quantity),
      tax_name1: 'VAT',
      tax_rate1: 10
    }));

    const invoiceData = {
      client_id: clientId,
      line_items: lineItems,
      invoice_number: orderNumber,
      po_number: orderNumber,
      terms: 'Net 30',
      footer: 'Thank you for your business!',
      public_notes: `Order Number: ${orderNumber}`,
      private_notes: `Order placed on ${new Date().toISOString()}`
    };

    const createInvoiceResponse = await fetch(`${INVOICE_NINJA_URL}/invoices`, {
      method: 'POST',
      headers: { 
        'X-API-Token': API_TOKEN,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(invoiceData)
    });

    const createInvoiceData = await createInvoiceResponse.json();
    
    if (!createInvoiceResponse.ok) {
      console.error('Invoice creation failed:', createInvoiceData);
      return res.status(500).json({ error: 'Failed to create invoice' });
    }

    const invoiceId = createInvoiceData.data.id;
    console.log('Created invoice:', invoiceId);

    // 3. Send invoice email
    const sendEmailResponse = await fetch(`${INVOICE_NINJA_URL}/email_invoice`, {
      method: 'POST',
      headers: { 
        'X-API-Token': API_TOKEN,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        invoices: [{ id: invoiceId }]
      })
    });

    if (!sendEmailResponse.ok) {
      console.error('Failed to send invoice email');
      return res.status(500).json({ error: 'Invoice created but failed to send email' });
    }

    console.log('Invoice sent successfully');
    res.json({ 
      success: true, 
      message: 'Invoice created and sent successfully',
      invoiceId: invoiceId
    });

  } catch (error) {
    console.error('Invoice Ninja integration error:', error);
    res.status(500).json({ error: 'Failed to process invoice' });
  }
});

const port = process.env.PORT || 3001;
httpsServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/api/test-connection', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connected', solution: results[0].solution });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send(err);
  }
});

// ================= FINANCE BI REPORTS =================

// Finance Sales Report
app.get('/api/finance/sales-report', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (from && to) {
      dateFilter = 'WHERE po.created_at BETWEEN ? AND ?';
      queryParams = [from, to];
    } else if (from) {
      dateFilter = 'WHERE po.created_at >= ?';
      queryParams = [from];
    } else if (to) {
      dateFilter = 'WHERE po.created_at <= ?';
      queryParams = [to];
    }

    // Get total sales and growth
    const totalSalesQuery = `
      SELECT 
        SUM(po.totalAmount) as totalSales,
        COUNT(DISTINCT po.id) as totalOrders,
        AVG(po.totalAmount) as averageOrderValue
      FROM placing_orders po
      ${dateFilter}
    `;
    
    const [salesData] = await pool.query(totalSalesQuery, queryParams);
    
    // Get monthly sales
    const monthlySalesQuery = `
      SELECT 
        DATE_FORMAT(po.created_at, '%Y-%m') as month,
        SUM(po.totalAmount) as sales
      FROM placing_orders po
      ${dateFilter}
      GROUP BY DATE_FORMAT(po.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;
    
    const [monthlySales] = await pool.query(monthlySalesQuery, queryParams);
    
    // Get sales by category
    const categorySalesQuery = `
      SELECT 
        COALESCE(f.mainCategory, 'Unknown') as category,
        SUM(oi.price * oi.quantity) as sales,
        COUNT(DISTINCT po.id) as orders
      FROM placing_orders po
      JOIN order_items oi ON po.id = oi.order_id
      JOIN fulldata f ON oi.partnumber = f.partnumber
      ${dateFilter}
      GROUP BY f.mainCategory
      ORDER BY sales DESC
    `;
    
    const [categorySales] = await pool.query(categorySalesQuery, queryParams);
    
    // Get top products
    const topProductsQuery = `
      SELECT 
        oi.description as name,
        SUM(oi.price * oi.quantity) as sales,
        SUM(oi.quantity) as units
      FROM placing_orders po
      JOIN order_items oi ON po.id = oi.order_id
      ${dateFilter}
      GROUP BY oi.description
      ORDER BY sales DESC
      LIMIT 10
    `;
    
    const [topProducts] = await pool.query(topProductsQuery, queryParams);

    // Mock growth data (in real app, compare with previous period)
    const mockGrowth = {
      salesGrowth: 12.5,
      orderGrowth: 8.3,
      aovGrowth: 3.8,
      conversionGrowth: 2.1
    };

    res.json({
      totalSales: parseFloat(salesData[0]?.totalSales || 0),
      totalOrders: parseInt(salesData[0]?.totalOrders || 0),
      averageOrderValue: parseFloat(salesData[0]?.averageOrderValue || 0),
      conversionRate: 15.2,
      salesGrowth: mockGrowth.salesGrowth,
      orderGrowth: mockGrowth.orderGrowth,
      aovGrowth: mockGrowth.aovGrowth,
      conversionGrowth: mockGrowth.conversionGrowth,
      monthlySales: monthlySales.map(item => ({
        month: item.month,
        sales: parseFloat(item.sales || 0)
      })),
      salesByCategory: categorySales.map(item => ({
        category: item.category,
        sales: parseFloat(item.sales || 0),
        percentage: ((parseFloat(item.sales || 0) / parseFloat(salesData[0]?.totalSales || 1)) * 100).toFixed(1),
        growth: Math.random() * 20 - 10 // Mock growth
      })),
      topProducts: topProducts.map(item => ({
        name: item.name,
        sales: parseFloat(item.sales || 0),
        units: parseInt(item.units || 0)
      }))
    });

  } catch (error) {
    console.error('Error fetching sales report:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// Finance Customers Report
app.get('/api/finance/customers-report', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (from && to) {
      dateFilter = 'WHERE po.created_at BETWEEN ? AND ?';
      queryParams = [from, to];
    } else if (from) {
      dateFilter = 'WHERE po.created_at >= ?';
      queryParams = [from];
    } else if (to) {
      dateFilter = 'WHERE po.created_at <= ?';
      queryParams = [to];
    }

    // Get customer metrics
    const customerMetricsQuery = `
      SELECT 
        COUNT(DISTINCT po.email) as totalCustomers,
        COUNT(DISTINCT CASE WHEN po.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN po.email END) as activeCustomers,
        AVG(po.totalAmount) as customerLifetimeValue
      FROM placing_orders po
      ${dateFilter}
    `;
    
    const [customerMetrics] = await pool.query(customerMetricsQuery, queryParams);
    
    // Get monthly customer growth
    const monthlyGrowthQuery = `
      SELECT 
        DATE_FORMAT(po.created_at, '%Y-%m') as month,
        COUNT(DISTINCT po.email) as customers
      FROM placing_orders po
      ${dateFilter}
      GROUP BY DATE_FORMAT(po.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;
    
    const [monthlyGrowth] = await pool.query(monthlyGrowthQuery, queryParams);
    
    // Get customer segments (mock data)
    const customerSegments = [
      { segment: 'Premium', count: 150, percentage: 15, averageValue: 2500 },
      { segment: 'Regular', count: 450, percentage: 45, averageValue: 800 },
      { segment: 'Occasional', count: 300, percentage: 30, averageValue: 300 },
      { segment: 'New', count: 100, percentage: 10, averageValue: 150 }
    ];
    
    // Get top customers
    const topCustomersQuery = `
      SELECT 
        po.email as name,
        SUM(po.totalAmount) as totalSpent,
        COUNT(po.id) as orders
      FROM placing_orders po
      ${dateFilter}
      GROUP BY po.email
      ORDER BY totalSpent DESC
      LIMIT 10
    `;
    
    const [topCustomers] = await pool.query(topCustomersQuery, queryParams);

    // Mock growth data
    const mockGrowth = {
      customerGrowth: 15.2,
      newCustomerGrowth: 22.1,
      clvGrowth: 8.5,
      retentionGrowth: 5.3
    };

    res.json({
      totalCustomers: parseInt(customerMetrics[0]?.totalCustomers || 0),
      newCustomers: 85,
      activeCustomers: parseInt(customerMetrics[0]?.activeCustomers || 0),
      customerLifetimeValue: parseFloat(customerMetrics[0]?.customerLifetimeValue || 0),
      retentionRate: 78.5,
      customerGrowth: mockGrowth.customerGrowth,
      newCustomerGrowth: mockGrowth.newCustomerGrowth,
      clvGrowth: mockGrowth.clvGrowth,
      retentionGrowth: mockGrowth.retentionGrowth,
      monthlyCustomerGrowth: monthlyGrowth.map(item => ({
        month: item.month,
        customers: parseInt(item.customers || 0)
      })),
      customerSegments: customerSegments,
      topCustomers: topCustomers.map(item => ({
        name: item.name,
        totalSpent: parseFloat(item.totalSpent || 0),
        orders: parseInt(item.orders || 0)
      }))
    });

  } catch (error) {
    console.error('Error fetching customers report:', error);
    res.status(500).json({ error: 'Failed to fetch customers data' });
  }
});

// Finance Costs Report
app.get('/api/finance/costs-report', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (from && to) {
      dateFilter = 'WHERE po.created_at BETWEEN ? AND ?';
      queryParams = [from, to];
    } else if (from) {
      dateFilter = 'WHERE po.created_at >= ?';
      queryParams = [from];
    } else if (to) {
      dateFilter = 'WHERE po.created_at <= ?';
      queryParams = [to];
    }

    // Get cost metrics
    const costMetricsQuery = `
      SELECT 
        SUM(po.totalAmount) as totalRevenue,
        SUM(po.totalAmount * 0.6) as estimatedCosts
      FROM placing_orders po
      ${dateFilter}
    `;
    
    const [costMetrics] = await pool.query(costMetricsQuery, queryParams);
    
    // Mock cost data
    const totalCosts = parseFloat(costMetrics[0]?.estimatedCosts || 0);
    const costOfGoodsSold = totalCosts * 0.7;
    const operatingExpenses = totalCosts * 0.3;
    const totalRevenue = parseFloat(costMetrics[0]?.totalRevenue || 0);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;

    // Mock cost categories
    const costCategories = [
      { category: 'Cost of Goods Sold', amount: costOfGoodsSold, percentage: 70, growth: 5.2 },
      { category: 'Operating Expenses', amount: operatingExpenses, percentage: 30, growth: 3.8 },
      { category: 'Marketing', amount: operatingExpenses * 0.3, percentage: 9, growth: 12.1 },
      { category: 'Administrative', amount: operatingExpenses * 0.4, percentage: 12, growth: 2.5 },
      { category: 'Technology', amount: operatingExpenses * 0.2, percentage: 6, growth: 8.7 },
      { category: 'Other', amount: operatingExpenses * 0.1, percentage: 3, growth: 1.2 }
    ];

    // Mock monthly costs
    const monthlyCosts = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      costs: totalCosts / 12 + (Math.random() - 0.5) * totalCosts / 12
    })).reverse();

    // Mock cost trends
    const costTrends = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      cogs: costOfGoodsSold / 12 + (Math.random() - 0.5) * costOfGoodsSold / 12,
      opex: operatingExpenses / 12 + (Math.random() - 0.5) * operatingExpenses / 12
    })).reverse();

    res.json({
      totalCosts: totalCosts,
      costOfGoodsSold: costOfGoodsSold,
      operatingExpenses: operatingExpenses,
      profitMargin: profitMargin,
      costsGrowth: 4.8,
      cogsGrowth: 5.2,
      opexGrowth: 3.8,
      marginGrowth: 2.1,
      costCategories: costCategories,
      monthlyCosts: monthlyCosts,
      costTrends: costTrends
    });

  } catch (error) {
    console.error('Error fetching costs report:', error);
    res.status(500).json({ error: 'Failed to fetch costs data' });
  }
});

// Finance Inventory Report
app.get('/api/finance/inventory-report', async (req, res) => {
  try {
    // Get inventory metrics
    const inventoryMetricsQuery = `
      SELECT 
        COUNT(DISTINCT f.id) as totalSkus,
        SUM(COALESCE(pp.stock_quantity, 0)) as totalStock,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) < 10 THEN 1 END) as lowStockItems,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) = 0 THEN 1 END) as outOfStockItems
      FROM fulldata f
      LEFT JOIN product_prices pp ON f.id = pp.product_id
    `;
    
    const [inventoryMetrics] = await pool.query(inventoryMetricsQuery);
    
    // Get stock levels by category
    const stockLevelsQuery = `
      SELECT 
        f.mainCategory as category,
        COUNT(f.id) as count,
        SUM(COALESCE(pp.stock_quantity, 0)) as totalStock,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) < 10 THEN 1 END) as lowStock
      FROM fulldata f
      LEFT JOIN product_prices pp ON f.id = pp.product_id
      WHERE f.mainCategory IS NOT NULL
      GROUP BY f.mainCategory
      ORDER BY count DESC
    `;
    
    const [stockLevels] = await pool.query(stockLevelsQuery);
    
    // Mock monthly inventory data
    const monthlyInventory = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      value: (parseFloat(inventoryMetrics[0]?.totalStock || 0) * 100) + (Math.random() - 0.5) * 10000
    })).reverse();

    // Mock inventory turnover by category
    const inventoryTurnoverByCategory = stockLevels.map(item => ({
      category: item.category,
      turnover: (Math.random() * 5 + 1).toFixed(1)
    }));

    res.json({
      totalSkus: parseInt(inventoryMetrics[0]?.totalSkus || 0),
      lowStockItems: parseInt(inventoryMetrics[0]?.lowStockItems || 0),
      outOfStockItems: parseInt(inventoryMetrics[0]?.outOfStockItems || 0),
      stockTurnover: 3.2,
      daysOfInventory: 114,
      stockoutRate: 2.1,
      skuGrowth: 8.5,
      lowStockChange: -12.3,
      outOfStockChange: -5.7,
      turnoverGrowth: 15.2,
      daysGrowth: -8.1,
      stockoutGrowth: -15.3,
      stockLevels: stockLevels.map(item => ({
        category: item.category,
        value: parseFloat(item.totalStock || 0) * 100,
        percentage: ((parseFloat(item.count || 0) / parseFloat(inventoryMetrics[0]?.totalSkus || 1)) * 100).toFixed(1),
        lowStock: parseInt(item.lowStock || 0),
        turnover: (Math.random() * 5 + 1).toFixed(1)
      })),
      monthlyInventory: monthlyInventory,
      inventoryTurnoverByCategory: inventoryTurnoverByCategory
    });

  } catch (error) {
    console.error('Error fetching inventory report:', error);
    res.status(500).json({ error: 'Failed to fetch inventory data' });
  }
});

// Finance Forecasting Report
app.get('/api/finance/forecasting-report', async (req, res) => {
  try {
    // Get historical revenue data
    const historicalRevenueQuery = `
      SELECT 
        DATE_FORMAT(po.created_at, '%Y-%m') as month,
        SUM(po.totalAmount) as actual
      FROM placing_orders po
      WHERE po.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(po.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;
    
    const [historicalRevenue] = await pool.query(historicalRevenueQuery);
    
    // Mock forecasting data
    const currentRevenue = parseFloat(historicalRevenue[0]?.actual || 0);
    const revenueForecast = currentRevenue * 1.15; // 15% growth
    const costForecast = revenueForecast * 0.65; // 65% of revenue
    const profitForecast = revenueForecast - costForecast;
    
    // Mock monthly forecasts
    const monthlyForecasts = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);
      const actual = historicalRevenue.find(h => h.month === month)?.actual || 0;
      const forecast = actual * (1 + (Math.random() * 0.2 + 0.1)); // 10-30% growth
      return {
        month: month,
        actual: parseFloat(actual),
        forecast: parseFloat(forecast),
        variance: ((forecast - actual) / actual * 100).toFixed(1)
      };
    });

    // Mock revenue forecast trend
    const revenueForecastTrend = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);
      const actual = historicalRevenue.find(h => h.month === month)?.actual || 0;
      const forecast = actual * (1 + (Math.random() * 0.2 + 0.1));
      return {
        month: month,
        actual: parseFloat(actual),
        forecast: parseFloat(forecast)
      };
    });

    // Mock profit forecast trend
    const profitForecastTrend = revenueForecastTrend.map(item => ({
      month: item.month,
      actual: item.actual * 0.35, // 35% profit margin
      forecast: item.forecast * 0.35
    }));

    // Mock risk factors
    const riskFactors = [
      { factor: 'Market Competition', impact: 25 },
      { factor: 'Supply Chain Disruption', impact: 20 },
      { factor: 'Economic Downturn', impact: 15 },
      { factor: 'Technology Changes', impact: 10 },
      { factor: 'Regulatory Changes', impact: 5 }
    ];

    res.json({
      revenueForecast: revenueForecast,
      costForecast: costForecast,
      profitForecast: profitForecast,
      forecastAccuracy: 87.5,
      revenueGrowth: 15.0,
      costGrowth: 8.5,
      profitGrowth: 22.3,
      accuracyChange: 2.1,
      monthlyForecasts: monthlyForecasts,
      revenueForecastTrend: revenueForecastTrend,
      profitForecastTrend: profitForecastTrend,
      riskFactors: riskFactors
    });

  } catch (error) {
    console.error('Error fetching forecasting report:', error);
    res.status(500).json({ error: 'Failed to fetch forecasting data' });
  }
});

// ================= WAREHOUSE BI REPORTS =================

// Warehouse Inventory Report
app.get('/api/warehouse/inventory-report', async (req, res) => {
  try {
    // Get inventory metrics
    const inventoryMetricsQuery = `
      SELECT 
        COUNT(DISTINCT f.id) as totalSkus,
        SUM(COALESCE(pp.stock_quantity, 0)) as totalStock,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) < 10 THEN 1 END) as lowStockItems,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) = 0 THEN 1 END) as outOfStockItems
      FROM fulldata f
      LEFT JOIN product_prices pp ON f.id = pp.product_id
    `;
    
    const [inventoryMetrics] = await pool.query(inventoryMetricsQuery);
    
    // Get stock levels by category
    const stockLevelsQuery = `
      SELECT 
        f.mainCategory as category,
        COUNT(f.id) as count,
        SUM(COALESCE(pp.stock_quantity, 0)) as totalStock,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) < 10 THEN 1 END) as lowStock
      FROM fulldata f
      LEFT JOIN product_prices pp ON f.id = pp.product_id
      WHERE f.mainCategory IS NOT NULL
      GROUP BY f.mainCategory
      ORDER BY count DESC
    `;
    
    const [stockLevels] = await pool.query(stockLevelsQuery);
    
    // Mock monthly stock levels
    const monthlyStockLevels = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      items: parseInt(inventoryMetrics[0]?.totalSkus || 0) + Math.floor((Math.random() - 0.5) * 50)
    })).reverse();

    // Mock stock status
    const stockStatus = [
      { status: 'In Stock', count: parseInt(inventoryMetrics[0]?.totalSkus || 0) - parseInt(inventoryMetrics[0]?.lowStockItems || 0) - parseInt(inventoryMetrics[0]?.outOfStockItems || 0) },
      { status: 'Low Stock', count: parseInt(inventoryMetrics[0]?.lowStockItems || 0) },
      { status: 'Out of Stock', count: parseInt(inventoryMetrics[0]?.outOfStockItems || 0) }
    ];

    res.json({
      totalSkus: parseInt(inventoryMetrics[0]?.totalSkus || 0),
      lowStockItems: parseInt(inventoryMetrics[0]?.lowStockItems || 0),
      outOfStockItems: parseInt(inventoryMetrics[0]?.outOfStockItems || 0),
      stockTurnover: 3.2,
      skuGrowth: 8.5,
      lowStockChange: -12.3,
      outOfStockChange: -5.7,
      turnoverGrowth: 15.2,
      stockLevels: stockLevels.map(item => ({
        category: item.category,
        count: parseInt(item.count || 0),
        percentage: ((parseFloat(item.count || 0) / parseFloat(inventoryMetrics[0]?.totalSkus || 1)) * 100).toFixed(1),
        lowStock: parseInt(item.lowStock || 0)
      })),
      monthlyStockLevels: monthlyStockLevels,
      stockStatus: stockStatus
    });

  } catch (error) {
    console.error('Error fetching warehouse inventory report:', error);
    res.status(500).json({ error: 'Failed to fetch warehouse inventory data' });
  }
});

// Warehouse Fulfillment Report
app.get('/api/warehouse/fulfillment-report', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (from && to) {
      dateFilter = 'WHERE po.created_at BETWEEN ? AND ?';
      queryParams = [from, to];
    } else if (from) {
      dateFilter = 'WHERE po.created_at >= ?';
      queryParams = [from];
    } else if (to) {
      dateFilter = 'WHERE po.created_at <= ?';
      queryParams = [to];
    }

    // Get fulfillment metrics
    const fulfillmentMetricsQuery = `
      SELECT 
        COUNT(po.id) as ordersFulfilled,
        AVG(po.totalAmount) as averageOrderValue
      FROM placing_orders po
      ${dateFilter}
    `;
    
    const [fulfillmentMetrics] = await pool.query(fulfillmentMetricsQuery, queryParams);
    
    // Mock monthly fulfillment data
    const monthlyFulfillment = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      orders: Math.floor(Math.random() * 100 + 50)
    })).reverse();

    // Mock fulfillment methods
    const fulfillmentMethods = [
      { method: 'Standard Shipping', count: 450, percentage: 60, avgTime: 3 },
      { method: 'Express Shipping', count: 225, percentage: 30, avgTime: 1 },
      { method: 'Same Day Delivery', count: 75, percentage: 10, avgTime: 0.5 }
    ];

    res.json({
      ordersFulfilled: parseInt(fulfillmentMetrics[0]?.ordersFulfilled || 0),
      fulfillmentRate: 98.5,
      averagePickTime: 15,
      onTimeDelivery: 96.2,
      fulfillmentGrowth: 12.3,
      rateChange: 1.2,
      pickTimeChange: -8.5,
      deliveryChange: 2.1,
      monthlyFulfillment: monthlyFulfillment,
      fulfillmentMethods: fulfillmentMethods
    });

  } catch (error) {
    console.error('Error fetching fulfillment report:', error);
    res.status(500).json({ error: 'Failed to fetch fulfillment data' });
  }
});

// Warehouse Activity Report
app.get('/api/warehouse/activity-report', async (req, res) => {
  try {
    // Mock warehouse activity data
    const totalActivities = 1250;
    const activeWorkers = 8;
    const equipmentUtilization = 85;
    const efficiencyScore = 92;

    // Mock daily activity
    const dailyActivity = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      activities: Math.floor(Math.random() * 200 + 100)
    }));

    // Mock activity types
    const activityTypes = [
      { type: 'Picking', count: 450, percentage: 36, avgDuration: 5 },
      { type: 'Packing', count: 350, percentage: 28, avgDuration: 3 },
      { type: 'Shipping', count: 250, percentage: 20, avgDuration: 2 },
      { type: 'Receiving', count: 150, percentage: 12, avgDuration: 8 },
      { type: 'Inventory', count: 50, percentage: 4, avgDuration: 15 }
    ];

    // Mock worker productivity
    const workerProductivity = [
      { worker: 'Worker A', activities: 180 },
      { worker: 'Worker B', activities: 165 },
      { worker: 'Worker C', activities: 155 },
      { worker: 'Worker D', activities: 145 },
      { worker: 'Worker E', activities: 135 }
    ];

    res.json({
      totalActivities: totalActivities,
      activeWorkers: activeWorkers,
      equipmentUtilization: equipmentUtilization,
      efficiencyScore: efficiencyScore,
      activityGrowth: 15.2,
      workerGrowth: 0,
      utilizationChange: 5.8,
      efficiencyChange: 3.2,
      dailyActivity: dailyActivity,
      activityTypes: activityTypes,
      workerProductivity: workerProductivity
    });

  } catch (error) {
    console.error('Error fetching activity report:', error);
    res.status(500).json({ error: 'Failed to fetch activity data' });
  }
});

// ================= USER MANAGEMENT BI REPORTS =================

// User Growth Report
app.get('/api/admin/user-growth-report', async (req, res) => {
  try {
    // Get user metrics
    const userMetricsQuery = `
      SELECT 
        COUNT(*) as totalUsers,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as newUsers
      FROM registration
    `;
    
    const [userMetrics] = await pool.query(userMetricsQuery);
    
    // Mock monthly growth
    const monthlyGrowth = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      users: parseInt(userMetrics[0]?.totalUsers || 0) + Math.floor((Math.random() - 0.5) * 50)
    })).reverse();

    // Mock user demographics
    const userDemographics = [
      { demographic: 'Business', count: 450, percentage: 45, growth: 12.5 },
      { demographic: 'Individual', count: 350, percentage: 35, growth: 8.2 },
      { demographic: 'Government', count: 150, percentage: 15, growth: 15.8 },
      { demographic: 'Educational', count: 50, percentage: 5, growth: 5.2 }
    ];

    // Mock registration sources
    const registrationSources = [
      { source: 'Direct', count: 400 },
      { source: 'Search Engine', count: 300 },
      { source: 'Social Media', count: 200 },
      { source: 'Referral', count: 100 }
    ];

    res.json({
      totalUsers: parseInt(userMetrics[0]?.totalUsers || 0),
      newUsers: parseInt(userMetrics[0]?.newUsers || 0),
      activeUsers: Math.floor(parseInt(userMetrics[0]?.totalUsers || 0) * 0.7),
      retentionRate: 78.5,
      userGrowth: 15.2,
      newUserGrowth: 22.1,
      activeUserGrowth: 12.8,
      retentionChange: 5.3,
      monthlyGrowth: monthlyGrowth,
      userDemographics: userDemographics,
      registrationSources: registrationSources
    });

  } catch (error) {
    console.error('Error fetching user growth report:', error);
    res.status(500).json({ error: 'Failed to fetch user growth data' });
  }
});

// User Segmentation Report
app.get('/api/admin/user-segmentation-report', async (req, res) => {
  try {
    // Mock segmentation data
    const totalSegments = 4;
    const premiumUsers = 150;
    const activeSegments = 3;

    // Mock user segments
    const userSegments = [
      { segment: 'Premium', count: 150, percentage: 15, averageValue: 2500 },
      { segment: 'Regular', count: 450, percentage: 45, averageValue: 800 },
      { segment: 'Occasional', count: 300, percentage: 30, averageValue: 300 },
      { segment: 'New', count: 100, percentage: 10, averageValue: 150 }
    ];

    // Mock segment performance
    const segmentPerformance = [
      { segment: 'Premium', value: 95 },
      { segment: 'Regular', value: 78 },
      { segment: 'Occasional', value: 45 },
      { segment: 'New', value: 25 }
    ];

    // Mock segment growth
    const segmentGrowth = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      premium: 150 + Math.floor((Math.random() - 0.5) * 20),
      regular: 450 + Math.floor((Math.random() - 0.5) * 50)
    })).reverse();

    res.json({
      totalSegments: totalSegments,
      premiumUsers: premiumUsers,
      activeSegments: activeSegments,
      segmentEngagement: 82.5,
      segmentGrowth: 8.5,
      premiumGrowth: 15.2,
      activeGrowth: 5.8,
      engagementChange: 3.2,
      userSegments: userSegments,
      segmentPerformance: segmentPerformance,
      segmentGrowth: segmentGrowth
    });

  } catch (error) {
    console.error('Error fetching user segmentation report:', error);
    res.status(500).json({ error: 'Failed to fetch user segmentation data' });
  }
});

// User Activity Report
app.get('/api/admin/user-activity-report', async (req, res) => {
  try {
    // Mock activity data
    const activeUsers = 700;
    const avgSessionDuration = 12;
    const totalPageViews = 15000;
    const bounceRate = 35;

    // Mock daily activity
    const dailyActivity = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      users: Math.floor(Math.random() * 200 + 500)
    }));

    // Mock activity types
    const activityTypes = [
      { type: 'Product Browsing', count: 6000, percentage: 40, avgDuration: 8 },
      { type: 'Order Placement', count: 3000, percentage: 20, avgDuration: 15 },
      { type: 'Account Management', count: 2500, percentage: 17, avgDuration: 5 },
      { type: 'Support Requests', count: 2000, percentage: 13, avgDuration: 20 },
      { type: 'Documentation', count: 1500, percentage: 10, avgDuration: 12 }
    ];

    // Mock user engagement
    const userEngagement = [
      { metric: 'Session Duration', value: 12 },
      { metric: 'Pages per Session', value: 4.5 },
      { metric: 'Return Rate', value: 65 },
      { metric: 'Engagement Score', value: 78 }
    ];

    res.json({
      activeUsers: activeUsers,
      avgSessionDuration: avgSessionDuration,
      totalPageViews: totalPageViews,
      bounceRate: bounceRate,
      activeGrowth: 12.5,
      sessionChange: 8.2,
      pageViewChange: 15.8,
      bounceChange: -5.3,
      dailyActivity: dailyActivity,
      activityTypes: activityTypes,
      userEngagement: userEngagement
    });

  } catch (error) {
    console.error('Error fetching user activity report:', error);
    res.status(500).json({ error: 'Failed to fetch user activity data' });
  }
});

// ================= PRODUCT ANALYTICS BI REPORTS =================

// Product Performance Report
app.get('/api/admin/product-performance-report', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (from && to) {
      dateFilter = 'WHERE po.created_at BETWEEN ? AND ?';
      queryParams = [from, to];
    } else if (from) {
      dateFilter = 'WHERE po.created_at >= ?';
      queryParams = [from];
    } else if (to) {
      dateFilter = 'WHERE po.created_at <= ?';
      queryParams = [to];
    }

    // Get product metrics
    const productMetricsQuery = `
      SELECT 
        COUNT(DISTINCT f.id) as totalProducts,
        COUNT(DISTINCT oi.partnumber) as activeProducts
      FROM fulldata f
      LEFT JOIN order_items oi ON f.partnumber = oi.partnumber
      LEFT JOIN placing_orders po ON oi.order_id = po.id
      ${dateFilter}
    `;
    
    const [productMetrics] = await pool.query(productMetricsQuery, queryParams);
    
    // Get top products
    const topProductsQuery = `
      SELECT 
        oi.description as name,
        SUM(oi.price * oi.quantity) as revenue,
        SUM(oi.quantity) as units
      FROM placing_orders po
      JOIN order_items oi ON po.id = oi.order_id
      ${dateFilter}
      GROUP BY oi.description
      ORDER BY revenue DESC
      LIMIT 10
    `;
    
    const [topProducts] = await pool.query(topProductsQuery, queryParams);
    
    // Get product categories
    const productCategoriesQuery = `
      SELECT 
        f.mainCategory as category,
        COUNT(f.id) as count,
        SUM(oi.price * oi.quantity) as revenue
      FROM fulldata f
      LEFT JOIN order_items oi ON f.partnumber = oi.partnumber
      LEFT JOIN placing_orders po ON oi.order_id = po.id
      ${dateFilter}
      WHERE f.mainCategory IS NOT NULL
      GROUP BY f.mainCategory
      ORDER BY count DESC
    `;
    
    const [productCategories] = await pool.query(productCategoriesQuery, queryParams);

    res.json({
      totalProducts: parseInt(productMetrics[0]?.totalProducts || 0),
      topPerformers: 25,
      totalRevenue: parseFloat(topProducts.reduce((sum, p) => sum + parseFloat(p.revenue || 0), 0)),
      avgRating: 4.2,
      productGrowth: 12.5,
      performerGrowth: 18.2,
      revenueGrowth: 15.8,
      ratingChange: 2.1,
      topProducts: topProducts.map(item => ({
        name: item.name,
        revenue: parseFloat(item.revenue || 0),
        units: parseInt(item.units || 0)
      })),
      productCategories: productCategories.map(item => ({
        category: item.category,
        count: parseInt(item.count || 0),
        percentage: ((parseFloat(item.count || 0) / parseFloat(productMetrics[0]?.totalProducts || 1)) * 100).toFixed(1),
        revenue: parseFloat(item.revenue || 0)
      }))
    });

  } catch (error) {
    console.error('Error fetching product performance report:', error);
    res.status(500).json({ error: 'Failed to fetch product performance data' });
  }
});

// Product Stock Report
app.get('/api/admin/product-stock-report', async (req, res) => {
  try {
    // Get stock metrics
    const stockMetricsQuery = `
      SELECT 
        COUNT(DISTINCT f.id) as totalSkus,
        SUM(COALESCE(pp.stock_quantity, 0)) as totalStock,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) < 10 THEN 1 END) as lowStockItems,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) = 0 THEN 1 END) as outOfStockItems
      FROM fulldata f
      LEFT JOIN product_prices pp ON f.id = pp.product_id
    `;
    
    const [stockMetrics] = await pool.query(stockMetricsQuery);
    
    // Get stock levels by category
    const stockLevelsQuery = `
      SELECT 
        f.mainCategory as category,
        COUNT(f.id) as count,
        SUM(COALESCE(pp.stock_quantity, 0)) as totalStock,
        COUNT(CASE WHEN COALESCE(pp.stock_quantity, 0) < 10 THEN 1 END) as lowStock
      FROM fulldata f
      LEFT JOIN product_prices pp ON f.id = pp.product_id
      WHERE f.mainCategory IS NOT NULL
      GROUP BY f.mainCategory
      ORDER BY count DESC
    `;
    
    const [stockLevels] = await pool.query(stockLevelsQuery);
    
    // Mock stock status
    const stockStatus = [
      { status: 'In Stock', count: parseInt(stockMetrics[0]?.totalSkus || 0) - parseInt(stockMetrics[0]?.lowStockItems || 0) - parseInt(stockMetrics[0]?.outOfStockItems || 0) },
      { status: 'Low Stock', count: parseInt(stockMetrics[0]?.lowStockItems || 0) },
      { status: 'Out of Stock', count: parseInt(stockMetrics[0]?.outOfStockItems || 0) }
    ];

    res.json({
      totalStockItems: parseInt(stockMetrics[0]?.totalSkus || 0),
      lowStockItems: parseInt(stockMetrics[0]?.lowStockItems || 0),
      outOfStockItems: parseInt(stockMetrics[0]?.outOfStockItems || 0),
      stockTurnover: 3.2,
      stockGrowth: 8.5,
      lowStockChange: -12.3,
      outOfStockChange: -5.7,
      turnoverGrowth: 15.2,
      stockLevels: stockLevels.map(item => ({
        category: item.category,
        count: parseInt(item.count || 0),
        percentage: ((parseFloat(item.count || 0) / parseFloat(stockMetrics[0]?.totalSkus || 1)) * 100).toFixed(1),
        lowStock: parseInt(item.lowStock || 0)
      })),
      stockStatus: stockStatus
    });

  } catch (error) {
    console.error('Error fetching product stock report:', error);
    res.status(500).json({ error: 'Failed to fetch product stock data' });
  }
});

// Product Trends Report
app.get('/api/admin/product-trends-report', async (req, res) => {
  try {
    // Mock trends data
    const trendingProducts = 15;
    const seasonalTrends = 8;
    const marketDemand = 85;

    // Mock trend categories
    const trendCategories = [
      { category: 'Compressors', count: 45, percentage: 30, trendScore: 85 },
      { category: 'Tools', count: 35, percentage: 23, trendScore: 78 },
      { category: 'Spare Parts', count: 30, percentage: 20, trendScore: 72 },
      { category: 'Accessories', count: 25, percentage: 17, trendScore: 68 },
      { category: 'Services', count: 15, percentage: 10, trendScore: 65 }
    ];

    // Mock trending products
    const trendingProductsList = [
      { name: 'Air Compressor XA90', score: 95 },
      { name: 'Impact Wrench Pro', score: 88 },
      { name: 'Filter Kit Premium', score: 82 },
      { name: 'Lubricant Advanced', score: 78 },
      { name: 'Maintenance Kit', score: 75 }
    ];

    res.json({
      trendingProducts: trendingProducts,
      seasonalTrends: seasonalTrends,
      marketDemand: marketDemand,
      trendVelocity: 12.5,
      trendingGrowth: 18.2,
      seasonalGrowth: 12.8,
      demandChange: 8.5,
      velocityChange: 15.3,
      trendCategories: trendCategories,
      trendingProductsList: trendingProductsList
    });

  } catch (error) {
    console.error('Error fetching product trends report:', error);
    res.status(500).json({ error: 'Failed to fetch product trends data' });
  }
});