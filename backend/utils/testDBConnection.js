// testDBConnection.js
require('dotenv').config();
const { Pool } = require('pg');

console.log('Testing database connection...');
console.log('Connection string:', process.env.DATABASE_URL);

// Extract parts of the connection string for diagnostics
try {
  const url = new URL(process.env.DATABASE_URL);
  console.log('Connection details:');
  console.log('- Host:', url.hostname);
  console.log('- Port:', url.port);
  console.log('- Username:', url.username);
  console.log('- Password:', url.password ? '********' : 'None');
  console.log('- Database:', url.pathname.substring(1));
} catch (err) {
  console.error('Error parsing connection string:', err.message);
}

// Create a pool and try to connect
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
async function testConnection() {
  let client;
  try {
    console.log('\nAttempting to connect...');
    client = await pool.connect();
    console.log('✓ Successfully connected to the database!');
    
    // Try to run a simple query
    console.log('\nTesting query...');
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✓ Query successful! Current time:', result.rows[0].current_time);
    
    console.log('\nConnection test completed successfully.');
  } catch (err) {
    console.error('\n✗ Connection failed:', err.message);
    console.error('Details:', err);
    
    // Provide some common troubleshooting tips
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify username and password are correct');
    console.log('3. Make sure the database "kitaabcart" exists');
    console.log('4. Check if your firewall allows connections to PostgreSQL port 5432');
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

testConnection();
