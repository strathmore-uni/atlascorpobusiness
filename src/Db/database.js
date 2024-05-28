const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'ultra-mediator-423907-a4:us-central1:atlascopco',
  user: 'atlascopco_admin',
  password: '10028mike.',
  database: 'your-database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db.promise();