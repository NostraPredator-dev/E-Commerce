import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://e-commerce-jp45.onrender.com/users/${currentUser.email}`
        );
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">User data not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Your Profile
        </h1>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex justify-center items-center mb-4">
            <span className="text-2xl font-semibold">
              {userData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="w-full">
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="text-lg font-semibold">{userData.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Email Address</p>
              <p className="text-lg font-semibold">{userData.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="text-lg font-semibold">{userData.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
