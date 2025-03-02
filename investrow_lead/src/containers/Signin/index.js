import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Input } from "../../components/UI/Input";
import { login } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import logo from "../../assets/images/Investrow_logo.png";
import { ForgotPasswordModal } from "../../components/ForgotPasswordModal";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const userLogin = (e) => {
    e.preventDefault();
    const user = { email, password };
    console.log("This is user", user);
    dispatch(login(user));
  };

  if (auth.authenticate) {
    return <Navigate to="/" />;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Row style={{ 
      background: "radial-gradient(circle, #ffffff 30%, #ffcc99 100%)", 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center"
    }}>
      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />

   
      {/* Login Section - Right Side */}
      <Col xs={12} md={6} style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "5px 5px 10px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "400px",
        margin: "auto"
      }}>
        <img className="max-h-16" src={logo} alt="Logo" />
        <p className="text-2xl font-[600] text-sky-500">Leads Management Tool</p>
        <p style={{ fontSize: "15px", fontWeight: "400", color: "gray", letterSpacing: "4px", marginTop: "10px" }}>
          MAXIMIZING CUSTOMER TOUCHPOINTS
        </p>
        <Form onSubmit={userLogin} style={{ width: "100%" }}>
          <Input placeholder="Enter email" type="text" value={email} required onChange={(e) => setEmail(e.target.value)}
            className="border border-black w-full p-2 mt-4 font-[600]" />
          <Input placeholder="Password" type="password" value={password} required onChange={(e) => setPassword(e.target.value)}
            className="border border-black w-full p-2 mt-4 font-[600]" />
          <Button variant="success" type="submit" className="bg-orange-300 p-2 rounded-full text-[18px] font-[600] mt-3 w-full hover:bg-orange-400">
            Sign In
          </Button>
          <a style={{ display: "block", marginTop: "10px", fontSize: "12px", cursor: "pointer" }} onClick={openModal}>
            Forgot Password?
          </a>
          <p style={{ fontSize: "15px", fontWeight: "400", color: "gray", letterSpacing: "4px", marginTop: "10px" }}>
Designed and Developed by A1 network and IT Solutions       </p>
        </Form>
      </Col>
    </Row>
  );
};
