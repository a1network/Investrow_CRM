import React, { useEffect } from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom"; // ✅ Import Link
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions";

import "../../assets/css/Header.css";
import logo from "../../assets/images/Investrow_logo.png";

export const Header = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user) {
      console.log("This is auth", auth.user.name);
    }
  }, [auth]);

  const signout = () => {
    dispatch(logout());
  };

  return (
    <Navbar className="fixed-top bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Navbar.Brand className="flex items-center text-gray-800 font-semibold text-lg">
  <Link to="/" className="flex items-center">
    <img src={logo} className="h-10 w-auto mr-2" alt="Investrow Logo" />
  </Link>
</Navbar.Brand>

      {/* User Info and Logout */}
      <div className="flex items-center gap-4">
        {auth.user ? (
          <Navbar.Text className="text-gray-700 font-medium">
            Welcome,{" "}
            <Link to="/admin-profile" className="text-sky-500 hover:underline">
              {auth.user.name}
            </Link>
          </Navbar.Text>
        ) : (
          <Navbar.Text className="text-gray-500">Not Logged In</Navbar.Text>
        )}

        <i
          className="bi bi-box-arrow-right text-xl text-green-500 cursor-pointer hover:text-red-500 transition"
          onClick={signout}
        ></i>
      </div>
    </Navbar>
  );
};
