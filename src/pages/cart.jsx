import React, { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";

function Cart({ searchTerm }) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleIncrement = (id) => {
    const item = cart.find((item) => item.id === id);
    handleQuantityChange(id, item.quantity + 1);
  };

  const handleDecrement = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item.quantity > 1) {
      handleQuantityChange(id, item.quantity - 1);
    }
  };

  useEffect(() => {
      if(searchTerm) {
      navigate(`../search?term=${encodeURIComponent(searchTerm)}`)
      }
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Shopping Cart</h2>
      {cart.length > 0 ? (
        <div>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-36 h-36 object-cover"
                />

                {/* Product Info */}
                <div className="flex-1 p-4">
                  <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mt-2">
                    Price: <span className="font-semibold">${item.price}</span>
                  </p>
                  <div className="flex items-center mt-4">
                    <label
                      htmlFor={`quantity-${item.id}`}
                      className="mr-2 text-gray-600 font-medium"
                    >
                      Quantity:
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l"
                      >
                        -
                      </button>
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-16 border p-1 text-center rounded"
                      />
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition m-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total Price Section */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mt-8">
            <h3 className="text-2xl font-bold text-gray-800">Total Price</h3>
            <p className="text-2xl font-extrabold text-gray-800">${totalPrice.toFixed(2)}</p>
          </div>

          {/* Checkout Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xl shadow-md transition mt-6"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-600">
            Your cart is empty. Start shopping now!
          </p>
          <button
            onClick={() => (navigate('../'))}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
