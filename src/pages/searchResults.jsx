import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import { searchProducts, getCategories } from "../services/productService";
import ProductCard from "../components/productCard";
import { useNavigate } from "react-router-dom";

function SearchResults({ searchTerm }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchData = async () => {
      if (searchTerm) {
        try {
          setLoading(true);

          const productData = await searchProducts(searchTerm);
          const products = productData.products || [];
          setFilteredProducts(products);

          const uniqueCategories = [...new Set(products.map((product) => product.category))];

          const apiCategories = await getCategories();

          const matchedCategories = apiCategories
            .filter((apiCategory) => uniqueCategories.includes(apiCategory.slug))
            .map((apiCategory) => ({ slug: apiCategory.slug, name: apiCategory.name }));

          setCategories(matchedCategories);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("../");
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

    if (selectedCategories.length > 0) {
      products = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    products = products.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );

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
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-600 animate-pulse">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="container mx-auto py-12 px-4 lg:px-12 lg:flex">
        {/* Sidebar for Filters */}
        <div className="w-full lg:w-1/4 bg-white shadow-md p-6 rounded-lg mb-8 lg:mb-0 lg:mr-8">
          <h3 className="text-xl md:text-2xl font-bold mb-6">Filters</h3>

          {/* Category Filter */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.slug}`}
                    value={category.slug}
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`category-${category.slug}`}
                    className="text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
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

          {/* Sorting Options */}
          <div>
            <label className="block text-lg font-semibold mb-4">Sort By</label>
            <select
              className="w-full border rounded-lg p-3"
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

        {/* Main Content: Search Results */}
        <div className="w-full lg:w-3/4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 text-center mb-8">
            Search Results for "{searchTerm}"
          </h2>
          {sortedAndFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAndFilteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <h3 className="text-lg md:text-xl font-semibold">
                No Products Found
              </h3>
              <p>Try searching with a different term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
