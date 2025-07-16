const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Only include these if the files exist and are exporting a router:
let cartRoutes;
let orderRoutes;

try {
  cartRoutes = require('./routes/cartRoutes');
} catch (err) {
  console.warn('⚠️ cartRoutes not found or has error:', err.message);
}

try {
  orderRoutes = require('./routes/orderRoutes');
} catch (err) {
  console.warn('⚠️ orderRoutes not found or has error:', err.message);
}

const app = express();
const PORT = process.env.PORT || 3081;

// Start server and initialize routes
async function startServer() {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully.');

    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/books', bookRoutes);

    if (cartRoutes) app.use('/api/cart', cartRoutes);
    if (orderRoutes) app.use('/api/orders', orderRoutes);

    app.get('/', (req, res) => {
      res.send('📚 Welcome to KitabCart API!');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

startServer();