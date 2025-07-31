// debug.js - Simple debugging tool for login issues
// Add this to your project and include it in your index.html

(function() {
  // Check localStorage on page load
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.group('Auth Debug Info');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('User role:', userData.role);
        console.log('User email:', userData.email);
        console.log('User ID:', userData.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    console.groupEnd();
  };
  
  // Run initial check
  checkAuth();
  
  // Listen for storage changes
  window.addEventListener('storage', checkAuth);
})();
