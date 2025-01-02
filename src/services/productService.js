import axios from 'axios';

const API_URL = "https://dummyjson.com";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, {params: {limit:15}});
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getProductByCategory = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/products/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for products:", error);
    return [];
  }
};

export const updateProductReview = async (productId, newReview) => {
  try {
    const productResponse = await axios.get(`${API_URL}/products/${productId}`);
    const productData = productResponse.data;

    const updatedReviews = [...productData.reviews, newReview];
    console.log(updatedReviews);

    const response = await fetch(`https://dummyjson.com/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviews: updatedReviews,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};
