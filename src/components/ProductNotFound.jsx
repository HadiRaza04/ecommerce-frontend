import React from 'react'
import { useNavigate } from 'react-router-dom';


const ProductNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-4 text-center">
  {/* Icon/Illustration Placeholder */}
  <div className="mb-6 flex justify-center">
    <div className="rounded-full bg-gray-100 p-6">
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>

  {/* Text Content */}
  <h2 className="text-3xl font-bold text-gray-900 mb-2">
    We couldn't find that product
  </h2>
  <p className="text-gray-600 mb-8 max-w-md">
    The item might be out of stock, or the link may have expired. 
    Try searching for something else or head back to our shop.
  </p>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-4">
    <p
    //   href="/products" 
      onClick={(e) => { e.preventDefault(); navigate("/products"); }}
      className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
    >
      Browse All Products
    </p>
    <p 
      onClick={(e) => { e.preventDefault(); navigate("/support"); }}
      className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
    >
      Contact Support
    </p>
  </div>

  {/* Quick Search Tip */}
  <div className="mt-12 pt-8 border-t border-gray-100 w-full max-w-lg">
    <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
      Popular Categories
    </p>
    <div className="flex flex-wrap justify-center gap-2">
      {['Electronics', 'Fashion', 'Home Decor', 'Sale'].map((cat) => (
        <span key={cat} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm cursor-pointer hover:bg-gray-200">
          {cat}
        </span>
      ))}
    </div>
  </div>
</div>
  )
}

export default ProductNotFound