import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProductByCategory } from "../services/productService";
import ProductCard from "../components/productCard";
import ReactSlider from "react-slider";

function CategoryPage({ searchTerm }) {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (searchTerm) {
      navigate(`../search?term=${encodeURIComponent(searchTerm)}`);
    }
  }, [searchTerm]);

  const applyFiltersAndSorting = () => {
    let filteredProducts = [...products];

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );

    if (sortOption === "priceLowToHigh") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighToLow") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    return filteredProducts;
  };

  const sortedAndFilteredProducts = applyFiltersAndSorting();

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
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-12 flex flex-col lg:flex-row">
        {/* Sidebar for Filters and Sorting */}
        <div className="lg:w-1/4 bg-white shadow-md p-6 rounded-lg mb-8 lg:mb-0">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="w-full">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="thumb"
                trackClassName="track"
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
                pearling
                minDistance={10}
              />
            </div>
          </div>

          {/* Sorting Options */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Sort By
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:w-3/4 lg:ml-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Products in this Category
          </h2>
          {sortedAndFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sortedAndFilteredProducts.map((product) => (
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
    </div>
  );
}

export default CategoryPage;
