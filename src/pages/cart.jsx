import React from "react";
import { useCart } from "../context/cartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cart.length > 0 ? (
        <div className="grid gap-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 p-4 border rounded shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
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
      ) : (
        <p className="text-center text-xl text-gray-600">
          Your cart is empty.
        </p>
      )}
    </div>
  );
}

export default Cart;
