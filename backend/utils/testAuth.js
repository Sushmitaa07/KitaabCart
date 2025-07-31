// testAuth.js - A quick utility to test the auth flow and database connection
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testAuthentication() {
  const client = await pool.connect();
  
  try {
    console.log('Testing database connection...');
    const connTest = await client.query('SELECT NOW()');
    console.log('Database connected:', connTest.rows[0].now);
    
    console.log('\nChecking for admin user...');
    const userResult = await client.query(`
      SELECT * FROM users WHERE email = 'admin@kitabcart.com'
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Admin user not found! Please check your database.');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ Admin user found:');
    console.log('- ID:', user.id);
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    
    // Test password verification with 'admin123'
    const testPassword = 'admin123';
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('\nTesting password verification with "admin123":');
    console.log(passwordMatch ? '✅ Password is correct!' : '❌ Password does not match!');
    
    if (!passwordMatch) {
      console.log('\nTrying to update password for admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(`
        UPDATE users SET password = $1 WHERE id = $2
      `, [hashedPassword, user.id]);
      console.log('✅ Password updated to "admin123"');
    }
    
    // Test JWT generation
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    });
    
    console.log('\nTesting JWT generation:');
    console.log('Token generated:', token.substring(0, 20) + '...');
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verification:', decoded);
      console.log('✅ JWT token is valid!');
    } catch (err) {
      console.log('❌ JWT token verification failed:', err.message);
    }
    
  } catch (err) {
    console.error('Error during authentication test:', err);
  } finally {
    client.release();
    pool.end();
  }
}

testAuthentication();
