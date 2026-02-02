import React, { useState } from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login';
import {Navigate, Route, Routes } from 'react-router-dom';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import Layout from './Layout';
import { useContext } from 'react';
import { CartContext } from './context/CartContext';

function App() {
  const { isLogin, setIsLogin } = useContext(CartContext);

  return (
    <>
      {(!isLogin) ?
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace={true} />} />
      </Routes> 
      :
  
        <Routes>

          <Route element={<Layout />}>
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/products/" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />

            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route path="/products" element={<Navigate to="/" replace={true} />} />
          </Route>
        </Routes>
      }
    </>
  )
}

export default App