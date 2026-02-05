import axios from 'axios';
import { MdOutlineFavorite, MdFavoriteBorder } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import baseURL from '../constraints';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // 1. Initialize favorites from localStorage (so they persist on refresh)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Sync favorites to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 3. Toggle Function: Adds or removes ID from the array
  const toggleFavourite = (productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId); // Remove
      } else {
        return [...prev, productId]; // Add
      }
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return setError("No token found");
      }

      try {
        const response = await axios.get(`${baseURL}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Error fetching products. Please login to see products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
        {error ? (
          <div className="col-span-full text-center py-10">
            <p className="text-red-500 font-bold mb-2">{error}</p>
            <NavLink to="/login" className="text-blue-500 hover:underline">Click here to Login</NavLink>
          </div>
        ) : (
          products.map((product) => {
            // Check if THIS specific product is in the favorites list
            const isFavorite = favorites.includes(product._id);

            return (
              <div
                key={product._id}
                className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                  <img
                    src={`${baseURL}${product.image[0]}` || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-blue-600 shadow-sm">
                    ${product.price}
                  </div>

                  {/* Heart Icon Container */}
                  <div 
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"} 
                    className={`absolute top-3 left-3 rounded-full bg-white/90 p-2 shadow-sm transition-all duration-300 z-0
                      ${isFavorite ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-blue-400 hover:scale-110'}`} 
                    onClick={(e) => {
                      e.stopPropagation(); // Stops the click from triggering the parent div
                      toggleFavourite(product._id);
                    }}
                  >
                    {isFavorite ? <MdOutlineFavorite size={22}/> : <MdFavoriteBorder size={22} />}
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-5">
                  <h3 className="mb-2 truncate text-xl font-bold text-gray-800 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-600 h-10">
                    {product.description}
                  </p>
                  
                  <button 
                    className="mt-4 w-full rounded-lg border-2 border-blue-600 py-2 text-sm font-semibold text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white" 
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Products;