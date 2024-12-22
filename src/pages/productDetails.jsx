import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2 className="text-center text-2xl text-gray-600">Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center text-2xl text-red-500">Product not found!</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.image} alt={product.title} className="w-full md:w-1/2 object-contain rounded-lg" />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.title}</h2>
          <p className="text-lg text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-gray-800 mb-6">Price: ${product.price}</p>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
