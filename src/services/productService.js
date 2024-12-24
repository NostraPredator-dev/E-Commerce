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

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
