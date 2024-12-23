import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/productCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <h2 className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="container mx-auto py-12">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Our Featured Products
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12">
          Discover the best products handpicked just for you!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
