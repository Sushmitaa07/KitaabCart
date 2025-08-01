// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import KitabCartLanding from './pages/KitabCartLanding';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BuyerHome from './pages/BuyerHome';
import AdminHome from './pages/AdminHome';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import BookCatalog from './pages/BookCatalog';
import BookDetail from './pages/BookDetail';
import ShoppingCart from './pages/ShoppingCart';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';

function AppContent() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#cdcdcd'}}>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<KitabCartLanding />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Buyer Routes */}
          <Route path="/buyer" element={<BuyerHome />} />
          <Route path="/buyer/dashboard" element={<BuyerHome />} />
          <Route path="/buyer-home" element={<BuyerHome />} />
          <Route path="/books" element={<BookCatalog />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/dashboard" element={<AdminHome />} />
          <Route path="/admin/books" element={<AdminBooks />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<KitabCartLanding />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;