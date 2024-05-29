import mysql from 'mysql2/promise';
import {Connector} from '@google-cloud/cloud-sql-connector';

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: 'ultra-mediator-423907-a4:us-central1:atlascopco',
  ipType: 'PUBLIC',
});
const pool = await mysql.createPool({
  ...clientOpts,
  user: 'atlascopco_admin',
  password: '10028mike.',
  database: 'AtlasCopco',
});
try {
  const conn = await pool.getConnection();
  const [result] = await conn.query('SELECT * FROM products');
  console.table(result);
} catch (error) {
  console.error("Error:", error);
} finally {
  await pool.end();
  connector.close();
}

await pool.end();
connector.close();