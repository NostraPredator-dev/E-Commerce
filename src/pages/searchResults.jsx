import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import { searchProducts, getCategories } from "../services/productService";
import ProductCard from "../components/productCard";
import { useSearchParams } from "react-router-dom";

function SearchResults({ searchTerm }) {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (searchTerm) {
        try {
          setLoading(true);

          // Fetch products based on search term
          const productData = await searchProducts(searchTerm);
          const products = productData.products || [];
          setFilteredProducts(products);

          // Extract unique categories from products
          const uniqueCategories = [...new Set(products.map((product) => product.category))];

          // Fetch categories from API
          const apiCategories = await getCategories();

          // Map API categories to the unique categories
          const matchedCategories = apiCategories
            .filter((apiCategory) => uniqueCategories.includes(apiCategory.slug))
            .map((apiCategory) => ({ slug: apiCategory.slug, name: apiCategory.name }));

          setCategories(matchedCategories);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSearchData();
  }, [searchTerm]);

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categorySlug)
        ? prevSelected.filter((slug) => slug !== categorySlug)
        : [...prevSelected, categorySlug]
    );
  };

  const applyFiltersAndSorting = () => {
    let products = [...filteredProducts];

    // Apply category filter
    if (selectedCategories.length > 0) {
      products = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply price range filter
    products = products.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );

    // Apply sorting
    if (sortOption === "priceLowToHigh") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighToLow") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    return products;
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
      <div className="container mx-auto py-12 px-6 lg:px-12 flex">
        {/* Sidebar for Filters and Sorting */}
        <div className="w-1/4 bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-gray-700 font-semibold mb-2">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.slug}`}
                    value={category.slug}
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${category.slug}`} className="text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

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
        <div className="w-3/4 ml-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Search Results for "{searchTerm}"
          </h2>
          {sortedAndFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedAndFilteredProducts.map((product) => (
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
    </div>
  );
}

export default SearchResults;
