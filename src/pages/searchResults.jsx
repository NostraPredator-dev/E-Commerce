import React, { useState, useEffect } from "react";
import { searchProducts } from "../services/productService";
import ProductCard from "../components/productCard";
import { useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchTerm = searchParams.get("term");

  useEffect(() => {
    const fetchSearchProducts = async () => {
      if (searchTerm) {
        try {
          setLoading(true);
          const data = await searchProducts(searchTerm);
          setFilteredProducts(data.products || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSearchProducts();
  }, [searchTerm]);

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
      <div className="container mx-auto py-12 px-6 lg:px-12">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Search Results for "{searchTerm}"
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p>Try searching with a different term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
