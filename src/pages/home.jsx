import React from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/productCard';

function Home() {
  const products = getProducts();

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;
