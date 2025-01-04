import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";
import axios from "axios";

function Header({ onSearch }) {
  const { currentUser, logOut } = useAuth();
  const { cart } = useCart();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${currentUser.email}`
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

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleHomeClick = () => {
    setSearchQuery("");
    onSearch("");
  };

  const uniqueItemsCount = cart.reduce((count, item) => count + 1, 0);

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top Row: Logo, Search Bar, and Navigation */}
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          {/* Logo */}
          <h1 className="text-2xl font-bold">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="hover:text-blue-300 transition"
            >
              E-Commerce
            </Link>
          </h1>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-grow mx-4 max-w-lg relative"
          >
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
          <div className="hidden sm:flex items-center space-x-6">
            {/* Home Icon */}
            <Link
              to="/"
              onClick={handleHomeClick}
              className="hover:text-blue-300 transition"
            >
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
            {currentUser && (
              <Link
                to="/cart"
                className="relative hover:text-blue-300 transition"
              >
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
                    d="M3 3h2l.4 2M7 13h10l1-7H6.4M16 17a2 2 0 11-4 0m6 0a2 2 0 11-4 0"
                  />
                </svg>
                {uniqueItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {uniqueItemsCount}
                  </span>
                )}
              </Link>
            )}
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
                  <span>{userData?.name || "User"}</span>
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
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-4 rounded-lg transition"
                >
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
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="sm:hidden flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative hover:text-blue-300 transition"
            >
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
                  d="M3 3h2l.4 2M7 13h10l1-7H6.4M16 17a2 2 0 11-4 0m6 0a2 2 0 11-4 0"
                />
              </svg>
              {uniqueItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {uniqueItemsCount}
                </span>
              )}
            </Link>
            <button
              className="sm:hidden focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
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
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Search Bar for Mobile */}
          <form
            onSubmit={handleSearch}
            className="mt-4 sm:hidden flex w-full relative"
          >
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
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 w-80 bg-gradient-to-br from-blue-600 to-blue-800 text-white h-full shadow-2xl z-50 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            className="focus:outline-none hover:text-blue-300 transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-6">
          {/* User Info (Optional) */}
          {currentUser && (
            <div className="flex items-center space-x-4 mb-6">
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                  {userData?.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{userData?.name || "User"}</h3>
                <p className="text-sm text-blue-200">{currentUser.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link
              to="/"
              className="block py-3 px-4 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              Home
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="block py-3 px-4 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleLogOut();
                  }}
                  className="w-full text-left py-3 px-4 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-3 px-4 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block py-3 px-4 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
