import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext.jsx';
import './products.css'
import { AiOutlineClose } from 'react-icons/ai';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import baseURL from '../constraints.js';

const Cart = () => {
  const { items, setItems } = useContext(CartContext);
  const notify = (msg) => toast(msg);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const removeFromCart = (id, e) => {
        e.stopPropagation()
        setItems((prev) => prev.filter(item => item._id !== id));
    };

const makePayment = async (e) => {
  e.stopPropagation();
  if (items.length === 0) return notify("Your cart is empty!");
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to proceed with checkout");
      return;
    }
    const response = await axios.post(`${baseURL}/checkout`,
      {
        cartItems: items,
      },
      { 
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
      }
    );
    const session = response.data;

    if (session.url) {
      window.location.href = session.url; 
    } else {
      console.error("Session URL not found");
    }

  } catch (error) {
    console.error("Checkout Error:", error);
  }
};

return (
    <div className="md:w-[70%] w-[80%] mt-12 m-auto relative bg-white rounded-md p-4 border-2 flex flex-col">
      <ToastContainer />
      <h1 className="text-4xl mb-4">Cart</h1>
      <AiOutlineClose size={30} className="absolute top-4 right-4 cursor-pointer" />

      <div className="overflow-y-auto h-[300px] flex flex-col items-center gap-3">
        {items.length === 0 && (
          <p className="text-gray-500 mt-10">Your cart is empty</p>
        )}

        {items.map((item) => (
          <div
            key={item._id}
            className="w-[80%] p-3 bg-gray-200 rounded-lg flex justify-between items-center"
          >
            <div>
              <h1 className="text-lg font-semibold">{item.name}</h1>
              <p className="font-bold">Rs: {item.price}</p>
            </div>

            <button
              onClick={(e) => removeFromCart(item._id, e)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={(e) => makePayment(e)}
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
        Proceed to checkout 🛒
      </button>

      <h1 className="text-2xl font-bold mt-4">
        Total: Rs {total}
      </h1>
    </div>
  );
}
export default Cart;