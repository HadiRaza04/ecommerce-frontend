import axios from 'axios';

import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const {addToCart} = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      // 1. Get the token from localStorage
      const token = localStorage.getItem('token');
      const cartItems = localStorage.getItem('cartItems');
      if(cartItems) addToCart([...cartItems]);
      if(!token) {
        // console.error("No token found", error.message);
        return setError("No token found");
      }

      try {
        const response = await axios.get('http://localhost:3000/products', {
          headers: {
            // 2. Attach the token as a Bearer token
            Authorization: `Bearer ${token}` 
          }
        });
        setProducts(response.data.data);
        setLoading(false);
        setError(null);
        // console.log(response.data.data);
        
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Error fetching products. Please login to see products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="text-center mt-10 pt-10">
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 animate-spin text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    
    <>
      {/* <h1 className='text-2xl font-bold lg:text-4xl'>Our Products</h1> */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
        
        {error ? 
          <div className="text-red-500 text-center mt-4">
            {error}
            <p>Plz login to see products</p>
            <NavLink to="/login" className="text-blue-500 hover:underline">Click here to Login</NavLink>
          

          </div> 
          : 
          products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/products/${product._id}`)}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-200">
              <img
                // Accessing the first index of the image array
                src={`http://localhost:3000${product.image[0]}` || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-blue-600 shadow-sm">
                ${product.price}
              </div>
            </div>

            {/* Details Container */}
            <div className="p-5">
              <h3 className="mb-2 truncate text-xl font-bold text-gray-800 group-hover:text-blue-600">
                {product.name}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-600">
                {product.description}
              </p>
              
              <button className="mt-4 w-full rounded-lg border-2 border-blue-600 py-2 text-sm font-semibold text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;