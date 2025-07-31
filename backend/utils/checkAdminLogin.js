// checkAdminLogin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Database connection using your existing environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkAdminUser() {
  const client = await pool.connect();
  
  try {
    console.log('Connecting to database...');
    
    // Check if the admin user exists
    const adminEmail = 'admin@kitabcart.com';
    const result = await client.query(`
      SELECT * FROM users WHERE email = $1
    `, [adminEmail]);
    
    if (result.rows.length === 0) {
      console.log('ERROR: No user found with email:', adminEmail);
      return;
    }
    
    const user = result.rows[0];
    console.log('Found user:');
    console.log('- ID:', user.id);
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- Created at:', user.created_at);
    
    // Test password match (without modifying anything)
    const testPassword = 'admin123';
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('\nPassword test:');
    console.log('- Test password:', testPassword);
    console.log('- Password matches:', passwordMatch ? 'YES ✅' : 'NO ❌');
    
    if (!passwordMatch) {
      console.log('- The stored hashed password doesn\'t match "admin123"');
    }
    
    // Additional check for role
    if (user.role !== 'admin') {
      console.log('\nWARNING: The user exists but does not have the "admin" role');
      console.log('Current role is:', user.role);
    }
    
    console.log('\nDiagnostic complete.');
  } catch (err) {
    console.error('Error during diagnostics:', err);
  } finally {
    client.release();
    pool.end();
  }
}

checkAdminUser();
