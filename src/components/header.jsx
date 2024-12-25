import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Header({ onSearch }) {
  const { currentUser, logOut } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${currentUser.email}`
        );
        setUserData(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleHomeCLick = () => {
    setSearchQuery("");
    onSearch("");
  }

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-12">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-blue-300 transition">
            E-Commerce
          </Link>
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow mx-4 max-w-lg relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-600 hover:text-blue-500 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.04-5.63a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </button>
        </form>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link to="/" onClick={handleHomeCLick} className="hover:text-blue-300 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 10.3V21h5v-6h6v6h5V10.3L12 3.5 4 10.3z"
              />
            </svg>
          </Link>
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {userData?.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-white"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                    {userData?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden sm:block">{userData?.name || "User"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10 overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogOut}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-4 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>

      {isLoading && (
        <p className="text-gray-300 text-center mt-2">Loading user data...</p>
      )}
      {error && (
        <p className="text-red-500 text-center mt-2">{error}</p>
      )}
    </header>
  );
}

export default Header;
