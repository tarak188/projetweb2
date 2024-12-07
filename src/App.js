import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import AddProd from './addprod';
import UserProducts from './userprod';
import LesProduits from './allproducts'; 
import WhishList from './whishlist'; 
import CreditCardPage from './creditcard';
import Home3 from './Home1';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/productajout" element={<AddProd />} />
          <Route path="/prodaffiche" element={<UserProducts />} />
          <Route path="/produits" element={<LesProduits />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/pannier" element={<WhishList />} />
          <Route path="/credit" element={<CreditCardPage />} />
          <Route path="/home" element={<Home3 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;