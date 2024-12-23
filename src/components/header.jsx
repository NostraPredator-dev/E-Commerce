import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Header() {
  const { currentUser, logOut } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">
            E-Commerce
          </Link>
        </h1>

        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            Home
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
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                    {userData?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span>{userData?.name || "User"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
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
                className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-4 rounded transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>

      {isLoading && <p className="text-gray-300 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </header>
  );
}

export default Header;
