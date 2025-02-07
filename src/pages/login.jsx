import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        setError("Invalid email format. Please enter a valid email address.");
        break;
      case "auth/user-not-found":
        setError("No account found with this email. Please sign up first.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password. Please try again or reset your password.");
        break;
      case "auth/email-already-in-use":
        setError("This email is already in use. Try logging in or using a different email.");
        break;
      case "auth/weak-password":
        setError("Your password is too weak. Please use a stronger password.");
        break;
      case "auth/too-many-requests":
        setError("Too many failed login attempts. Please wait and try again later.");
        break;
      case "auth/user-disabled":
        setError("Your account has been disabled. Contact support for assistance.");
        break;
      case "auth/network-request-failed":
        setError("Network error. Please check your internet connection and try again.");
        break;
      case "auth/requires-recent-login":
        setError("This action requires recent authentication. Please log in again.");
        break;
      case "auth/operation-not-allowed":
        setError("This authentication method is currently disabled. Contact support.");
        break;
      default:
        setError("An unknown error occurred: " + error.message);
        break;
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await logIn(email, password);
      navigate("/");
    } catch(e) {
      e = e.message
      handleAuthError(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();     
      navigate("/");
    } catch (e) {
      e = e.message
      handleAuthError(e)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Log in to your account to continue
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
          >
            Log In
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 mt-3 bg-white border border-gray-300 py-2 sm:py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition duration-200 text-sm sm:text-base shadow-sm active:scale-95"
        >
          <FcGoogle className="text-xl sm:text-2xl" /> Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
