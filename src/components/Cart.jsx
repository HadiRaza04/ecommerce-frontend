import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext.jsx';
import './products.css'
import { AiOutlineClose } from 'react-icons/ai';

const Cart = () => {
  const { items, setItems } = useContext(CartContext);
const total = items.reduce((sum, item) => sum + item.price, 0);
//   const removeFromCart = (e, id) => {
//     const updatedCart = items.filter(item => item._id !== id);
//     setItems(updatedCart);
//     e.stopPropagation()
//   };
  const removeFromCart = (id, e) => {
        e.stopPropagation()
        setItems((prev) => prev.filter(item => item._id !== id));
    };
//   const cartItems = cart.items.map((item, index) => {
//     return (
//       <div className='w-[80%] h-[120px] m-2 p-2 bg-gray-300 rounded-lg flex flex-col' key={index}>
//         <div>
//           <h1 className='text-md'>{item.title}</h1>
//         </div>
//         <div className='flex flex-row items-center justify-between m-2'>
//           <p className='font-bold'>Rs: {item.price}</p>
//           <button type='button' className='w-[90px] h-[40px] m-2 text-white hover:bg-orange-700 p-2 rounded-md border-none bg-orange-600' onClick={(e) => removeFromCart(e, item.id)}>Remove</button>
//         </div>
//       </div>
//     )
//   })
//   return (
    // <div className='md:w-[70%] w-[80%] mt-12 m-auto  relative lg:mt-12 bg-white rounded-md p-2 border-2 flex flex-col '>
    //     <h1 className='text-4xl '>
    //       Cart
    //     </h1>
    //     {/* onClick={() => setNav(!nav)}  */}
    //     <AiOutlineClose size={ 30 } className='absolute top-4 right-4 cursor-pointer'/>
    //     <div className='overflow-scroll xyz h-[300px] flex flex-col items-center pt-4'>
    //         {cartItems}
    //     </div>
    //     <div className=' bottom-2 w-[90%]  p-3'>
    //       <div className='w-[100%] h-[5px] '>
    //         {/* line */}
    //       </div>
    //       <h1 className='text-2xl mt-4  font-bold'>Total {total} Rupees </h1>
    //     </div>
    // </div>
//   )

return (
    <div className="md:w-[70%] w-[80%] mt-12 m-auto relative bg-white rounded-md p-4 border-2 flex flex-col">
      
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

      <h1 className="text-2xl font-bold mt-4">
        Total: Rs {total}
      </h1>
    </div>
  );
}
export default Cart;