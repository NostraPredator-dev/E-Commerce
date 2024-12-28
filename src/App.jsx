import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Cart from "./pages/cart";
import ProductDetails from "./pages/productDetails";
import PrivateRoute from "./components/privateRoute";
import Header from "./components/header";
import Footer from "./components/footer";
import Profile from "./pages/profile";
import SearchResults from "./pages/searchResults";
import CategoryPage from "./pages/categoryPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={setSearchTerm}/>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults searchTerm={searchTerm}/>} />
          <Route path="/category" element={<CategoryPage searchTerm={searchTerm}/>} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart searchTerm={searchTerm }/>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
