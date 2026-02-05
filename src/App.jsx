import React from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import Layout from './Layout';
import { useContext } from 'react';
import { CartContext } from './context/CartContext';
import AdminDashboard from './components/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Favourite from './components/Favourite';

function App() {
  const { isLogin } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      {(!isLogin) ? (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace={true} />} />
        </Routes> 
      ) : (
        <Routes>
          {isAdmin && <Route path="/dashboard" element={<AdminDashboard />} />}
          <Route element={<Layout />}>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/" element={<Navigate to="/products" replace={true} />} />
            <Route path="*" element={<Navigate to="/products" replace={true} />} />
          </Route>
        </Routes>
      )}
    </>
  )
}
export default App