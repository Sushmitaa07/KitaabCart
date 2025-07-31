require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../db');

// Get the new password from command line args or use default
const newPassword = process.argv[2] || 'admin123';

async function resetAdminPassword() {
  try {
    console.log('Connecting to database...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the admin user's password
    const result = await db.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email, role',
      [hashedPassword, 'admin@kitabcart.com']
    );
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('✅ Admin password reset successfully!');
      console.log(`- ID: ${admin.id}`);
      console.log(`- Name: ${admin.name}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Role: ${admin.role}`);
      console.log(`- New Password: ${newPassword}`);
      console.log('\nYou can now login with:');
      console.log(`Email: ${admin.email}`);
      console.log(`Password: ${newPassword}`);
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

resetAdminPassword();
