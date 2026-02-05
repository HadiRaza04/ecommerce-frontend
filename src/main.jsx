import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from './context/CartContext.jsx';

const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={clientid}>
      <CartProvider>
        <App />
      </CartProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)