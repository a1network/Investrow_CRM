import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Signin } from "./containers/Signin";
import { Home } from "./containers/Home";
import UserProfile from "./containers/Profile/UserProfile";
import AdminProfile from "./containers/Profile/AdminProfile";
import { authConstants } from "./actions/constants";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // ✅ Load user from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ If user is authenticated, go to Home; else, go to Signin */}
        <Route path="/" element={auth.authenticate ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={auth.authenticate ? <Navigate to="/" /> : <Signin />} />
        <Route path="/user-profile" element={auth.authenticate ? <UserProfile /> : <Navigate to="/signin" />} />
        <Route path="/admin-profile" element={auth.authenticate ? <AdminProfile /> : <Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
