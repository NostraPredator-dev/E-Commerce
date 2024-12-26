import React, { useState, useEffect, useRef } from "react";
import { getProducts, searchProducts, getCategories } from "../services/productService";
import ProductCard from "../components/productCard";
import { useNavigate } from "react-router-dom";

function Home({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const categoryRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData.products);

        const categoriesData = await getCategories();
        setCategories(categoriesData || []);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching products or categories:", error);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    if(searchTerm) {
      navigate(`search?term=${encodeURIComponent(searchTerm)}`)
    }
  }, [searchTerm]);
  
  const handleCategoryClick = (categoryName) => {
    navigate(`category?name=${categoryName}`);
  }

  useEffect(() => {
    let isScrolling = false;

    const smoothScroll = () => {
      if (categoryRef.current && !isScrolling) {
        categoryRef.current.scrollLeft += 1;
      }
      scrollRef.current = requestAnimationFrame(smoothScroll);
    };

    scrollRef.current = requestAnimationFrame(smoothScroll);

    const handleScrollStart = () => {
      isScrolling = true;
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    };

    const handleScrollStop = () => {
      isScrolling = false;
      scrollRef.current = requestAnimationFrame(smoothScroll);
    };

    const refElement = categoryRef.current;
    if (refElement) {
      refElement.addEventListener("mousedown", handleScrollStart);
      refElement.addEventListener("mouseup", handleScrollStop);
      refElement.addEventListener("touchstart", handleScrollStart);
      refElement.addEventListener("touchend", handleScrollStop);
    }

    return () => {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
      if (refElement) {
        refElement.removeEventListener("mousedown", handleScrollStart);
        refElement.removeEventListener("mouseup", handleScrollStop);
        refElement.removeEventListener("touchstart", handleScrollStart);
        refElement.removeEventListener("touchend", handleScrollStop);
      }
    };
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
      <div className="container mx-auto py-12 px-6 lg:px-12">
        {/* Rotating Category Carousel */}
        <div className="mb-8 overflow-hidden">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Browse by Category</h2>
          <div
            ref={categoryRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide whitespace-nowrap"
          >
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.slug)}
                className="bg-blue-200 inline-block px-6 py-3 rounded-lg text-gray-800 text-lg font-semibold cursor-pointer hover:bg-blue-300 transition"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Our Featured Products</h2>
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
