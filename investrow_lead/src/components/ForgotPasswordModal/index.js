import axios from "../../helpers/axios";
import React, { useState, useEffect } from "react";

// Define a custom styles object for background and layout
const styles = {
  modalBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  formField: {
    marginBottom: "15px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  },
  closeButton: {
    padding: "10px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
};

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Reset Code, Step 3: New Password

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Logic to send email for reset (could be API call)
      axios
        .post("/send-code", { email: email })
        .then((response) => {
          if (response.status === 200) {
            setStep(2);
            console.log("Code is sent to Email Id", response);
            alert("Reset Code is Sent to Email Id");
          } else {
            console.log("This is the response", response);
          }
        })
        .catch((error) => {
          alert(error.response.data);
          console.log("Error while updating password", error.response.data);
        });
      //console.log(`Sending reset code to: ${email}`);
      // Move to next step (reset code input)
    }
  };

  const handleResetCodeSubmit = (e) => {
    e.preventDefault();
    if (resetCode) {
      axios
        .post("/verify-code-update-password", {
          email: email,
          enteredCode: resetCode,
        })
        .then((response) => {
          if (response.status === 200) {
            setStep(3);
            alert(response.data);
          } else {
            console.log("This is the response", response);
          }
        })
        .catch((error) => {
          alert(error.response.data);
          console.log("Error while updating password", error.response.data);
        });
    }
  };

  const handleSubmitNewPassword = (e) => {
    e.preventDefault();
    if (newPassword) {
      axios
        .post("/update-password", {
          email: email,
          newPassword: newPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            //setStep(3);
            alert(response.data);
            console.log("Password Updated Successfully", response);
          } else {
            console.log("This is the response", response);
          }
        })
        .catch((error) => {
          alert(error.response.data);
          console.log("Error while updating password", error.response.data);
        });
      //onClose();
    }
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // Close the modal if the user clicks outside of it
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.modalBackground} onClick={handleClickOutside}>
      <div style={styles.modalContent}>
        <h2>Reset Your Password</h2>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div style={styles.formField}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formField}>
              <button type="submit" style={styles.button}>
                Send Reset Code
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetCodeSubmit}>
            <div style={styles.formField}>
              <input
                type="text"
                placeholder="Enter the reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formField}>
              <button type="submit" style={styles.button}>
                Verify Reset Code
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitNewPassword}>
            <div style={styles.formField}>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formField}>
              <button type="submit" style={styles.button}>
                Submit New Password
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: "15px" }}>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
