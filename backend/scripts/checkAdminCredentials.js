// scripts/checkAdminCredentials.js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Connection string:', process.env.DATABASE_URL);
    
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    const res = await client.query('SELECT NOW()');
    console.log('Current database time:', res.rows[0].now);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', err.message);
    return false;
  }
}

async function checkAdminUser() {
  try {
    console.log('\nChecking for admin users...');
    const client = await pool.connect();
    
    const result = await client.query('SELECT id, name, email, role FROM users WHERE role = $1', ['admin']);
    
    if (result.rows.length === 0) {
      console.log('❌ No admin users found in the database');
    } else {
      console.log('✅ Admin users found:');
      result.rows.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Error checking admin users:', err.message);
  }
}

async function resetAdminPassword(email, newPassword) {
  if (!email) {
    console.error('❌ Email is required to reset password');
    return;
  }
  
  try {
    console.log(`\nResetting password for admin: ${email}`);
    const hashedPassword = await bcrypt.hash(newPassword || 'admin123', 10);
    
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE email = $2 AND role = $3 RETURNING id, name, email',
      [hashedPassword, email, 'admin']
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ No admin user found with email: ${email}`);
    } else {
      console.log(`✅ Password reset successful for: ${result.rows[0].name} (${result.rows[0].email})`);
      console.log(`New password: ${newPassword || 'admin123'}`);
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Error resetting admin password:', err.message);
  }
}

async function main() {
  const connectionSuccessful = await checkConnection();
  
  if (connectionSuccessful) {
    await checkAdminUser();
    
    // Check if a third argument was provided for the admin email
    const adminEmail = process.argv[2];
    const newPassword = process.argv[3];
    
    if (adminEmail) {
      await resetAdminPassword(adminEmail, newPassword);
    }
  }
  
  // Close the pool
  await pool.end();
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
