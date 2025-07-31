// createAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdminUser() {
  const client = await pool.connect();
  
  try {
    // Check if admin already exists
    const checkResult = await client.query(`
      SELECT * FROM users WHERE role = 'admin' LIMIT 1
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists:');
      console.log('Email:', checkResult.rows[0].email);
      
      // Update admin password for convenience
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(`
        UPDATE users 
        SET password = $1 
        WHERE id = $2
      `, [hashedPassword, checkResult.rows[0].id]);
      
      console.log('Updated admin password to: admin123');
      return;
    }
    
    // Create new admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const result = await client.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
    `, ['Admin User', 'admin@kitabcart.com', hashedPassword, 'admin']);
    
    console.log('Admin user created successfully:');
    console.log(result.rows[0]);
    console.log('Password: admin123');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    client.release();
    pool.end();
  }
}

createAdminUser();
