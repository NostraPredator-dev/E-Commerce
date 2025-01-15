import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://e-commerce-jp45.onrender.com/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !reviewComment) {
      alert("Please fill in both rating and comment.");
      return;
    }

    const existingReview = product.reviews.find(
      (review) => review.reviewerEmail === currentUser.email
    );

    if (existingReview) {
      alert("You have already submitted a review for this product.");
      setRating(0);
      setReviewComment("");
      return;
    }

    const newReview = {
      rating: rating,
      comment: reviewComment,
      date: new Date().toISOString(),
      reviewerName: currentUser.name || "",
      reviewerEmail: currentUser.email || "",
    };

    try {
      await axios.post(`http://localhost:5000/products/${id}/reviews`, newReview);
      setRating(0);
      setReviewComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "Failed to submit review. Please try again.");
    }
  };

  if (loading) {
    return <h2 className="text-center text-2xl text-gray-600">Loading...</h2>;
  }

  if (!product) {
    return (
      <h2 className="text-center text-2xl text-red-500">Product not found!</h2>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full md:w-1/2 object-contain rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.title}</h2>
          <p className="text-yellow-500 font-bold mb-4">
            {"★".repeat(product.rating) + "☆".repeat(5 - Math.floor(product.rating))} (
            {product.rating})
          </p>
          <p className="text-lg text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-gray-800 mb-6">Price: ${product.price}</p>
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-700">
                    {review.reviewerName} ({review.reviewerEmail})
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-yellow-500 font-bold mb-2">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {currentUser && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Add a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Rating (1-5 stars)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Your Review
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Write your review here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
