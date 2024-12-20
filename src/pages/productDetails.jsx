import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { CartContext } from '../context/cartContext';

function ProductDetails() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useContext(CartContext);

  if (!product) return <h2 className="text-center text-xl font-semibold text-red-500">Product Not Found</h2>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h2>
      <p className="text-lg text-gray-600 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-gray-800 mb-6">Price: ${product.price}</p>
      <button 
        onClick={() => addToCart(product)} 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;
