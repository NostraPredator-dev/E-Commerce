import React, { useState, useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-64">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-contain w-full h-full max-h-64 mx-auto"
        />
      </div>

      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 truncate">{product.title}</h3>
        
        <p
          className={`text-gray-600 mt-2 ${
            !isExpanded ? 'line-clamp-2' : ''
          } transition-all duration-300`}
        >
          {product.description}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 text-sm mt-2 underline"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold text-blue-500">
            ${product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
