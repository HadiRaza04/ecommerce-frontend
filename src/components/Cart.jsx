import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import "./products.css";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import baseURL from "../constraints.js";

const Cart = () => {
  const { items, addToCart, increaseQuantity, removeFromCart, deleteItem } =
    useContext(CartContext);
  const [isOpen, setIsOpen] = useState(true);

  // 1. FIX: Lock background scroll when Cart is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Cleanup: Restore scroll when Cart is closed
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const notify = (msg) => toast(msg);

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const qty = item.quantity || 0;
    return sum + price * qty;
  }, 0);

  const makePayment = async (e) => {
    e.stopPropagation();
    if (items.length === 0) return notify("Your cart is empty!");

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to proceed with checkout");

      const response = await axios.post(
        `${baseURL}/checkout`,
        { cartItems: items },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const session = response.data;
      if (session.url) {
        window.location.href = session.url;
      } else {
        notify("Payment gateway error. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      notify("Checkout failed. Please check your connection.");
    }
  };

  return (
    /* 2. FIX: Stop click propagation on the main container */
    <div
      onClick={(e) => e.stopPropagation()}
      className="md:w-[70%] w-[90%] mt-2 m-auto relative bg-white rounded-xl p-6 border shadow-2xl flex flex-col"
    >
      <ToastContainer position="top-center" autoClose={1500} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Your Cart</h1>
        <AiOutlineClose
          size={28}
          className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
        />
      </div>

      {/* 3. FIX: Stop wheel/scroll propagation in the scrollable area */}
      <div
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="overflow-y-auto max-h-[200px] pr-2 custom-scrollbar flex flex-col gap-4"
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-400 text-xl italic">
              The cart is looking a bit lonely... 🛒
            </p>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={`${baseURL}${item.product?.image?.[0]}`}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h1 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {item.product?.name}
                  </h1>
                  <p className="text-blue-600 font-bold text-md">
                    Rs: {item.product?.price?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.product?._id);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-red-50 text-red-500 font-black transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 font-bold text-gray-700">
                    {item.quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseQuantity(item.product?._id);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-green-50 text-green-600 font-black transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem
                    ? deleteItem(item.product?._id)
                    : removeFromCart(item.product?._id);
                    notify("Item remove from cart.");
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Remove from cart"
                >
                  <HiOutlineTrash size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 border-t-2 border-dashed pt-6 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Subtotal
            </p>
            <h1 className="text-3xl font-black text-gray-900">
              Rs {total.toLocaleString()}
            </h1>
          </div>
          <p className="text-gray-400 text-sm italic">
            Taxes and shipping calculated at checkout
          </p>
        </div>

        <button
          onClick={(e) => makePayment(e)}
          disabled={items.length === 0}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-3"
        >
          Checkout Now 💳
        </button>
      </div>
    </div>
  );
};

export default Cart;
