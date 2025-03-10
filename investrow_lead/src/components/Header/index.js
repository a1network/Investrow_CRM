import React, { useEffect, useState } from "react";
import { Navbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions";
import { IoMdAddCircle } from "react-icons/io";

import "../../assets/css/Header.css";
import logo from "../../assets/images/Investrow_logo.png";

export const Header = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]); // Replace with actual user fetching logic
  const userRole = "admin"; // Replace with actual user role from state

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

      {/* Additional Elements (Add Lead, Add User, Search, Show Users) */}
      <div className="flex items-center gap-10 justify-around">
        <span
          onClick={() => console.log("Add Lead Clicked")}
          className="cursor-pointer flex items-center gap-1 font-semibold text-sky-500"
        >
          <IoMdAddCircle /> Add Lead
        </span>
        {userRole === "admin" && (
          <span
            onClick={() => console.log("Add User Clicked")}
            className="cursor-pointer flex items-center gap-1 font-semibold text-sky-500"
          >
            <IoMdAddCircle /> Add User
          </span>
        )}

        <Row className="cursor-pointer flex gap-8">
          <Col className="col-10 text-muted"></Col>
          <Col className="col-1">
            {showSearch && (
              <input
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for leads"
              />
            )}
            <a
              className="btn-sm"
              variant="success"
              type="btn"
              style={{
                border: "1px solid rgb(194, 189, 189)",
                borderRadius: "5px",
              }}
            >
              <i
                onClick={() => setShowSearch(!showSearch)}
                className="bi bi-search text-white ms-2"
              ></i>
            </a>
          </Col>
        </Row>

        <span
          className="text-sky-500 font-medium cursor-pointer"
          onClick={() => setShowUsers(!showUsers)}
        >
          Show Users
        </span>

        {showUsers && (
          <div className="absolute bg-white border border-gray-300 shadow-md p-3 rounded-lg max-h-40 overflow-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <p key={user.user_id} className="text-gray-700">
                  {user.name}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No users available</p>
            )}
          </div>
        )}
      </div>

      {/* User Info and Logout */}
      <div className="flex items-center gap-4">
        {auth.user ? (
          <Navbar.Text className="text-gray-700 font-medium">
            Welcome, {" "}
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
