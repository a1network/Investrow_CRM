import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./containers/Signin";
import { Home } from "./containers/Home";
import UserProfile from "./containers/Profile/UserProfile";
import AdminProfile from "./containers/Profile/AdminProfile";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
