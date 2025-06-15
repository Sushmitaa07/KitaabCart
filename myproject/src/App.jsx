import React from 'react'; 

import Login from './login_Page';
import Register from './register';
import HomePage from './Homepage';
import { Routes, Route } from 'react-router-dom'; 





function App() { 
  return ( 
    <Routes> 
      
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} /> 
      <Route path="/" element={<HomePage />} /> 
    </Routes> 
  ); 
} 


export default App;
