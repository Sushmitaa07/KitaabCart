require('dotenv').config();
const db = require('../db');

async function checkAdminPassword() {
  try {
    console.log('Connecting to database...');
    console.log(`Connection string: ${process.env.DATABASE_URL}`);
    
    // Check the admin user's password hash
    const result = await db.query(
      'SELECT id, name, email, role, password FROM users WHERE email = $1',
      ['admin@kitabcart.com']
    );
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('Admin user found:');
      console.log(`- ID: ${admin.id}`);
      console.log(`- Name: ${admin.name}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Role: ${admin.role}`);
      console.log(`- Password Hash: ${admin.password}`);
      console.log('\nNote: This is the hashed password, not the plain text password.');
      console.log('You cannot directly see the original password from this hash.');
    } else {
      console.log('❌ Admin user not found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

checkAdminPassword();
