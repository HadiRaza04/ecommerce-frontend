import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import baseURL  from '../constraints';
import { CartContext } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';


const FavoritesPage = () => {
    const { items, addToCart, increaseQuantity, removeFromCart, deleteItem } = useContext(CartContext);
    const navigate = useNavigate();
    
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // const API_BASE_URL = "http://localhost:3000";
    // Get token from local storage
    const token = localStorage.getItem('token'); 

    // 1. Fetch Favorites on Mount
    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${baseURL}/favourite`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setLoading(false);
        }
    };

    // 2. Handle Remove (Toggle)
    const handleRemove = async (productId) => {
        try {
            // Using the toggle endpoint we created earlier
            await axios.post(`${baseURL}/favourite/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update UI instantly by filtering out the removed product
            setFavorites(prev => prev.filter(item => item._id !== productId));
        } catch (error) {
            alert("Failed to remove product");
        }
    };
    const handleAddToCart = async () => {
        try {
          // We pass the whole product or just product._id 
          // depending on how you wrote your Context. 
          // Our previous Context update handles this!
          await addToCart(product); 
          notify(`${product.name} added to cart!`);
        } catch (err) {
          toast.error("Failed to add item to cart.");
        }
    };

    if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading your favorites...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                    My Favorites ({favorites.length})
                </h1>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">You haven't added any favorites yet.</p>
                        <button className="mt-4 text-blue-600 hover:underline" onClick={() => navigate("/products")}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
                                {/* Product Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img 
                                        src={`${baseURL}${product.image[0]}`} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <button 
                                        onClick={() => handleRemove(product._id)}
                                        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-colors text-red-500 shadow-sm"
                                        title="Remove from favorites"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                                    
                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <span className="text-xl font-bold text-blue-600">Rs. {product.price}</span>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            onClick={()=> addToCart(product._id)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;