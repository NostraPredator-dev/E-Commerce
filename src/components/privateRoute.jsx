import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return currentUser ? children 
  :(
  <div className="container mx-auto px-4 py-8 text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
    <p className="text-lg text-gray-600">
      You need to log in to view and manage items in your cart.
    </p>
    <button
      onClick={() => navigate("../login")}
      className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
    >
      Go to Login
    </button>
  </div>
  );
}

export default PrivateRoute;
