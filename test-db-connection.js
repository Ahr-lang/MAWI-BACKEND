require('dotenv').config();
const { Client } = require('pg');

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASS ? '***' + process.env.DB_PASS.slice(-4) : 'MISSING');
console.log('SSL:', process.env.DB_SSL);

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'postgres',
  ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
});

client.connect()
  .then(() => {
    console.log('\n✅ Connection successful!');
    return client.query('SELECT version()');
  })
  .then((res) => {
    console.log('PostgreSQL version:', res.rows[0].version);
    return client.end();
  })
  .catch((err) => {
    console.error('\n❌ Connection failed:', err.message);
    process.exit(1);
  });
