import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Login = () => {
  const { isLogin, setIsLogin } = useContext(CartContext);

     const notify = (msg) => toast(msg);
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/products', { replace: true });
      setIsLogin(true);
    }
  }, [navigate]);
  
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      // console.log('Form Submitted:', formData);
      
      setStatus({
        loading: false,
        message: 'Account login successfully!',
        type: 'success',
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      notify(response.data.message);

      setTimeout(() => {
        navigate('/products');
      }, 2500);

    } catch (error) {
      setStatus({
        loading: false,
        message: error.response?.data?.message || 'Something went wrong. Try again.',
        type: 'error',
      });
      // console.error('Signin Error:', error);
      notify(error.response?.data?.message || 'Login failed. Please try again.');
    }
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Login to Your Account
        </h2>
        <ToastContainer />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;