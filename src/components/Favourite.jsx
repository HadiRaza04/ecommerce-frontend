import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { MdDeleteOutline, MdOutlineShoppingBag } from "react-icons/md";
import baseURL from '../constraints';

const Favourite = () => {
  const [favProducts, setFavProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavData = async () => {
    const token = localStorage.getItem('token');
    const favIds = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favIds.length === 0) {
      setFavProducts([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch all products and filter locally (or create a specific backend route for this)
      const response = await axios.get(`${baseURL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allProducts = response.data.data;
      // Filter products whose ID exists in the favorites array
      const filtered = allProducts.filter(product => favIds.includes(product._id));
      
      setFavProducts(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavData();
  }, []);

  const removeFromFav = (productId) => {
    // 1. Get current list from localStorage
    const favIds = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // 2. Filter out the ID
    const updatedIds = favIds.filter(id => id !== productId);
    
    // 3. Save back to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedIds));
    
    // 4. Update UI state
    setFavProducts(prev => prev.filter(p => p._id !== productId));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">My Wishlist</h1>
        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
          {favProducts.length} Items
        </span>
      </div>

      {favProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-4 flex justify-center">
            <MdOutlineShoppingBag size={80} />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Your wishlist is empty</h2>
          <p className="text-gray-500 mt-2 mb-6">Explore our products and add your favorites here!</p>
          <NavLink to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Go Shopping
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProducts.map((product) => (
            <div key={product._id} className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="w-1/3 h-40 overflow-hidden">
                <img 
                  src={`${baseURL}${product.image[0]}`} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg truncate leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-black text-sm mb-2">
                    ${product.price}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => removeFromFav(product._id)}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    title="Remove from Wishlist"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourite;