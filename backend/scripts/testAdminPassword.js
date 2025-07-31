require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../db');

// Array of common passwords to test
const commonPasswords = [
  'admin123',
  'admin',
  'password',
  'password123',
  '123456',
  'admin@123',
  'kitabcart',
  'kitabcart123',
  'kitabcartadmin',
  'books123',
  '1234',
  'Admin123',
  'Admin',
  'Password',
  'Password123'
];

async function testAdminPasswords() {
  try {
    console.log('Connecting to database...');
    
    // Get the admin user's password hash
    const result = await db.query(
      'SELECT password FROM users WHERE email = $1',
      ['admin@kitabcart.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    const adminHash = result.rows[0].password;
    console.log('Testing common passwords against admin hash...');
    
    // Test each password
    let found = false;
    for (const password of commonPasswords) {
      process.stdout.write(`Testing "${password}"... `);
      const isMatch = await bcrypt.compare(password, adminHash);
      
      if (isMatch) {
        console.log('✅ MATCH FOUND!');
        console.log('\n==================================');
        console.log(`The admin password is: ${password}`);
        console.log('==================================\n');
        found = true;
        break;
      } else {
        console.log('❌ No match');
      }
    }
    
    if (!found) {
      console.log('\n❌ None of the common passwords matched.');
      console.log('Try logging in with a custom password or reset the admin password in the database.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

testAdminPasswords();
