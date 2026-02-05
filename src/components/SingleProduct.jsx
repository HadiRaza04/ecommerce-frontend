import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { CartContext } from "../context/CartContext.jsx";
import axios from "axios";
import ProductCarousel from "./ProductImagesCarousel.jsx";
import { ToastContainer, toast } from 'react-toastify';
import ProductNotFound from "./ProductNotFound.jsx";
import baseURL from "../constraints.js";

const SingleProduct = () => {
  const notify = (msg) => toast(msg);
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
        const token = localStorage.getItem('token');
      try {
         const res = await axios.get(`${baseURL}/products/${id}`, {
          headers: {
            // 2. Attach the token as a Bearer token
            Authorization: `Bearer ${token}` 
          }
        });
        setProduct(res.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (!product) {
    return (
      <ProductNotFound />
    );
  }
  // const images = product.image.map((img, index) => (<img key={index} src={`${baseURL}${img}`} alt={product.name} />));
//   const addToCart = (item, index) => {
//         cart.setItems([{title: item.name, price: item.price, id: item.id}, ...cart.items])
//         alert("Item added to cart.")
//     }

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      <ToastContainer />
      <div className="max-w-5xl mx-auto p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-lg rounded-xl p-6">
    
        
  

    {/* LEFT: Product Image */}
    {/* <div className="flex justify-center items-center bg-gray-100 rounded-xl p-6">
      <img
        src={`${baseURL}${product.image[0]}`}
        alt={product.name}
        className="
          w-full
          max-w-md
          h-80
          object-contain
          rounded-xl
          shadow-md
          hover:scale-105
          transition-transform
          duration-300
        "
      />
    </div> */}
    {/* {images} */}
    
      <ProductCarousel product={product} />
   

    {/* RIGHT: Product Details */}
    <div className="flex flex-col justify-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {product.name}
      </h1>

      <p className="text-gray-600 mb-5">
        {product.description}
      </p>

      <p className="text-2xl font-semibold text-green-600 mb-6">
        Rs. {product.price}
      </p>

      <button
        onClick={() => {addToCart(product); notify("Item added to cart!");}}
        className="
          bg-black
          text-white
          px-6
          py-3
          rounded-lg
          hover:bg-gray-800
          transition
          cursor-pointer
        "
      >
        Add to Cart 🛒
      </button>
    </div>

  </div>
</div>

    </div>
  );
};

export default SingleProduct;