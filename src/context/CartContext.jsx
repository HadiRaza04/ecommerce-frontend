import React, { createContext, useState } from "react";
export const CartContext = createContext(null);

export const CartProvider = (props) => {
    const [items, setItems] = useState([]);
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem('token'));
    const addToCart = (product) => {
        console.log("Added to cart:", product);
    setItems((prev) => [...prev, product]);
    localStorage.setItem('cartItems', JSON.stringify([...items, product]) );
    setItems([...items, product]);
  };
    return (
        <CartContext.Provider value={{items, setItems, addToCart, isLogin, setIsLogin}}>
            {props.children}
        </CartContext.Provider>
    )
}