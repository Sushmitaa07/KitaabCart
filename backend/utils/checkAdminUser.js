// checkAdminUser.js - Check if admin user exists in the database
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkAdminUser() {
  const client = await pool.connect();
  try {
    console.log('Connected to database successfully');
    
    // Check for admin user
    const result = await client.query(
      "SELECT id, name, email, role FROM users WHERE email = 'admin@kitabcart.com'"
    );
    
    if (result.rows.length === 0) {
      console.log('Admin user not found in the database');
    } else {
      console.log('Admin user found:');
      console.log(result.rows[0]);
      
      // Check all users in the system for debugging
      const allUsers = await client.query(
        "SELECT id, name, email, role FROM users"
      );
      
      console.log('\nAll users in the system:');
      console.table(allUsers.rows);
    }
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

checkAdminUser();
