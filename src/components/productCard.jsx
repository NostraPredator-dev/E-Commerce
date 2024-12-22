import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200">
      <img src={product.image} alt={product.title} className="w-full h-64 object-contain p-4" />
      <div className="px-6 py-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 truncate">{product.title}</h3>
        <p className="text-gray-700 text-base mb-4">Price: ${product.price}</p>
        <Link
          to={`/product/${product.id}`}
          className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
