import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

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

  const signUp = async ({name, phone, email, password}) => {
    createUserWithEmailAndPassword(auth, email, password);
    try {
      const response = await axios.post('http://localhost:5000/users', {
        name,
        phone,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  }
  const logIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password);
  }
  const logOut = () => {
    signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
