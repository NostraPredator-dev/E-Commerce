import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductByCategory, getProducts } from "../services/productService";
import ProductCard from "../components/productCard";

function CategoryPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categorySlug = searchParams.get("name");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        if (categorySlug) {
          const productsData = await getProductByCategory(categorySlug);
          setProducts(productsData.products || []);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categorySlug]);

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
          Products in this Category
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p>Try exploring other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
