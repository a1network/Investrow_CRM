import jwt from "jsonwebtoken";
import { db } from "../../index.js";

export const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const email = decoded.email;

    const [userData] = await db
      .promise()
      .query("SELECT role FROM users WHERE email = ?", [email]);

    if (userData.length === 0) {
      return res.status(404).send("User not found");
    }

    if (userData[0].role === "admin") {
      next();
    } else {
      res.send("Only Admins can add Users");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

