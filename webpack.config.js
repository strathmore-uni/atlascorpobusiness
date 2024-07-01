const fs = require('fs');
const path = require('path');

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('C:\\Users\\mikek\\Desktop\\Atlas Corpos Business\\atlascorpobusiness\\cert\\client-key.pem'),
      cert: fs.readFileSync('C:\\Users\\mikek\\Desktop\\Atlas Corpos Business\\atlascorpobusiness\\cert\\client-cert.pem'),
      // Include intermediate certificate if provided
      ca: fs.readFileSync('C:\\Users\\mikek\\Desktop\\Atlas Corpos Business\\atlascorpobusiness\\cert\\server-ca.pem'),
    },
    host: '0.0.0.0',
    port: 3000,
  },
};
