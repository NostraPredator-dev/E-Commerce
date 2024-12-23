import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVgYqsWX8xDFHF7XTUOZdSx0cjR1aZ2Qs",
  authDomain: "e-commerce-site-373a9.firebaseapp.com",
  projectId: "e-commerce-site-373a9",
  storageBucket: "e-commerce-site-373a9.firebasestorage.app",
  messagingSenderId: "558820629045",
  appId: "1:558820629045:web:9f8dabda302ceabb04af7c",
  measurementId: "G-391040K1KV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);