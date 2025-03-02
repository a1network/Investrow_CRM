import React, { useEffect } from "react";
import { Navbar } from "react-bootstrap";
import "../../assets/css/Header.css";
import logo from "../../assets/images/Investrow_logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions";

/**
 * @author
 * @function Header
 **/

export const Header = (props) => {
  const auth = useSelector((state) => state.auth);
  /* const userName = auth.user.firstname;
  const lastName = auth.user.lastname; */
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("This is auth", auth.user.name);
  }, []);
  const signout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Navbar className="navbar fixed-top">
        <Navbar.Brand className="brand">
          <img src={logo} className="nav-logo" alt="" />
          
        </Navbar.Brand>
        <Navbar.Toggle></Navbar.Toggle>
        <Navbar.Collapse
          className=" flex items-center justify-end pr-[30px] mt-[-30px]" /* className="justify-content-end" */
        >
          <Navbar.Text className="user">Welcome: {auth.user.name}</Navbar.Text>
          <Navbar.Text>
            <i className="bi bi-box-arrow-right" onClick={signout}></i>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
