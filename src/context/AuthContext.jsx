import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from 'axios';

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async ({ name, phone, email, password }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await axios.post('https://e-commerce-jp45.onrender.com/users', {
        name,
        phone,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.log(error.code)
      throw new Error(error.code || 'Signup failed');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
  
      if (!result || !result.user) {
        throw new Error("Google sign-in was not completed.");
      }
  
      const name = result.user.displayName;
      const email = result.user.email;
      const phone = result.user.phoneNumber;
  
      let userExists = false;
  
      try {
        const getUserResponse = await axios.get(`https://e-commerce-jp45.onrender.com/googleUsers/${email}`);
        if (getUserResponse.data) {
          userExists = true;
        }
      } catch (getError) {
        if (getError.response && getError.response.status !== 404) {
          console.error("Unexpected error checking user:", getError);
        }
      }
  
      if (!userExists) {
        await axios.post("https://e-commerce-jp45.onrender.com/googleUsers", { name, phone, email });
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Google Sign-In was closed before completion.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.warn("Multiple sign-in requests detected. Only one is allowed.");
      } else {
        console.error("Google Sign-In Error:", error);
      }
    }
  };
  
  
  const logIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error.code || 'Login failed');
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, signUp, logIn, signInWithGoogle, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
