import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserEmail(user?.email || '');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async ({name, phone, email, password}) => {
    createUserWithEmailAndPassword(auth, email, password);
    setUserEmail(email);
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
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
    setUserEmail(email);
  }
  const logOut = () => {
    signOut(auth);
    setUserEmail("");
  }

  return (
    <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut, userEmail }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
