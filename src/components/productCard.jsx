import React, { useState, useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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
      <div className="relative w-full sm:h-48">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-contain w-full h-full max-h-64 sm:max-h-48 xs:max-h-40 mx-auto"
        />
      </div>

      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-gray-800 truncate sm:text-lg">
          {product.title}
        </h3>

        <p
          className={`text-sm text-gray-600 mt-2 ${
            !isDescriptionExpanded ? 'line-clamp-2' : ''
          } transition-all duration-300`}
        >
          {product.description}
        </p>
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="text-blue-500 text-sm mt-2 underline"
        >
          {isDescriptionExpanded ? 'Read Less' : 'Read More'}
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <span className="lg:text-lg font-semibold text-blue-500 text-base">
            ${product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 mt-2 sm:mt-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
