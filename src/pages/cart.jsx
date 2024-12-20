import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <h2 className="text-center text-xl font-semibold text-gray-600 mt-8">
        Your cart is empty
      </h2>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Cart</h2>
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border rounded shadow-md bg-white">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600">Price: ${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
