import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { db } from "../../index.js";
import dotenv from "dotenv";

dotenv.config();

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS,
  },
});

const login = async (req, res) => {
  try {
    const [userdata] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [req.body.email]);

    if (userdata.length === 0) {
      return res.status(404).send("Invalid Email ID entered");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      userdata[0].password
    );
    if (!validPassword) {
      return res.status(404).send("Invalid Password");
    } else {
      let token = jwt.sign(
        { email: userdata[0].email },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      const user = {
        user_id: userdata[0].user_id,
        name: userdata[0].name,
        email: userdata[0].email,
        role: userdata[0].role,
        mob: userdata[0].mob,
      };

      res.status(200).send({
        user,
        token,
      });
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

const addUser = async (req, res) => {
  const { name, email, password, role, mob } = req.body;

  const mailOption = {
    from: process.env.SENDER_EMAIL,
    to: email, // Recipient's email
    subject: "Welcome to Our Platform - Your Account Credentials",
    text: `
      Dear ${name},
  
      Congratulations! You've been successfully added as a new user on our platform. We are excited to have you join us.
  
      Here are your account details:
  
      Email: ${email}
      Password: ${password}
  
      To log in, simply visit our website and enter your email and the password provided above. 
  
      If you encounter any issues or have any questions, feel free to reach out to our support team at info@investrow.in.
  
      We look forward to your engagement and hope you enjoy the experience with us!
  
      Best regards,
      Investrow
    `,
  };

  if (!name || !email || !password || !role || !mob) {
    return res
      .status(400)
      .send("All fields are required: name, email, password, role, mob");
  }

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users (name, email, password, role, mob) VALUES (?, ?, ?, ?, ?)`;

    const values = [name, email, hashedPassword, role, mob];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("Failed to add user.");
      }
      transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log("Error sending mail ", err);
          //return res.send(err.message);
        }
        console.log("This is info of transporter", info);
      });
      res
        .status(200)
        .send({ message: "User added successfully", user_id: result.insertId });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    return res.status(500).send("Failed to hash password.");
  }
};

const getAllLeads = async (req, res) => {
  try {
    const leadsQuery = "SELECT * FROM leads";
    const usersQuery = "SELECT * FROM users";

    // Await the results of both queries
    const [results] = await db.promise().query(leadsQuery);
    const [userResults] = await db.promise().query(usersQuery);

    if (results.length === 0) {
      return res.status(404).send("No leads found");
    }

    if (userResults.length === 0) {
      return res.status(404).send("No users found");
    }

    const userData = userResults.map((user) => ({
      user_id: user.user_id,
      name: user.name,
    }));

    // Return both results in the response
    res.status(200).json({
      message: "Leads and users fetched successfully",
      leads: results,
      users: userData,
    });
  } catch (err) {
    console.error("Error: ", err);
    return res.status(500).send("Failed to fetch data");
  }
};

const addLead = (req, res) => {
  const {
    full_name,
    mobile_no,
    email_id,
    service,
    client,
    address,
    reference_name_no,
    remarks,
    follow_up_date_time,
    action,
    userId,
    userName,
  } = req.body;

  console.log("This is request body", req.body);

  if (!full_name || !mobile_no || !email_id || !service || !client || !action) {
    return res.status(400).send("All required fields must be provided");
  }

  const userIdValue = userId || null;
  const userNameValue = userName || null;

  // Insert query to add a new lead to the database
  const query = `
    INSERT INTO leads (full_name, mobile_no, email_id, service, client, address, reference_name_no, remarks, follow_up_date_time, action, user_id, user_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    full_name,
    mobile_no,
    email_id,
    service,
    client,
    address,
    reference_name_no,
    remarks,
    follow_up_date_time,
    action,
    userIdValue,
    userNameValue,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting lead: ", err.message);
      return res.status(500).send("Failed to add lead");
    }

    console.error("Add lead result: ", result);

    // Send response back to the client
    res.status(200).json({
      message: "Lead added successfully" /* , lead_id: result.insertId */,
    });
  });
};

const editLead = (req, res) => {
  const lead_id = req.query.lead_id;
  const {
    full_name,
    mobile_no,
    email_id,
    service,
    client,
    address,
    reference_name_no,
    remarks,
    follow_up_date_time,
    action,
    userId,
    userName,
  } = req.body;

  if (!full_name || !mobile_no || !email_id || !service || !client || !action) {
    return res.status(400).send("All required fields must be provided");
  }

  //console.log(req.body)
  const userIdValue = userId || null;
  const userNameValue = userName || null;

  const query = `
  UPDATE leads
  SET full_name = ?, mobile_no = ?, email_id = ?, service = ?, client = ?, address = ?, reference_name_no = ?, remarks = ?, follow_up_date_time = ?, action = ?,user_id = ?, user_name = ?
  WHERE lead_id = ?
  `;

  const values = [
    full_name,
    mobile_no,
    email_id,
    service,
    client,
    address,
    reference_name_no,
    remarks,
    follow_up_date_time,
    action,
    userId,
    userName,
    lead_id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating lead: ", err.message);
      return res.status(500).send("Failed to update lead");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Lead not found");
    }
    res.status(200).json({ message: "Lead updated successfully" });
  });
};
const assignLead = (req, res) => {
  const lead_id = req.params.lead_id;
  const {
    full_name,
    mobile_no,
    email_id,
    service,
    client,
    address,
    reference_name_no,
    remarks,
    follow_up_date_time,
    action,
  } = req.body;

  if (!full_name || !mobile_no || !email_id || !service || !client || !action) {
    return res.status(400).send("All required fields must be provided");
  }

  const query = `
    UPDATE leads
    SET full_name = ?, mobile_no = ?, email_id = ?, service = ?, client = ?, address = ?, reference_name_no = ?, remarks = ?, follow_up_date_time = ?, action = ?
    WHERE lead_id = ?
  `;

  const values = [
    full_name,
    mobile_no,
    email_id,
    service,
    client,
    address,
    reference_name_no,
    remarks,
    follow_up_date_time,
    action,
    lead_id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating lead: ", err);
      return res.status(500).send("Failed to update lead");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Lead not found");
    }

    // Send response back to the client
    res.status(200).json({ message: "Lead updated successfully" });
  });
};
const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching leads: ", err);
      return res.status(500).send("Failed to fetch Users");
    }

    if (results.length === 0) {
      return res.status(404).send("No Users found");
    }

    res.status(200).json({
      message: "Users fetched successfully",
      leads: results,
    });
  });
};

const deleteLead = (req, res) => {
  const lead_ids = req.query.lead_id;

  const query = `
    DELETE FROM leads WHERE lead_id = ?
  `;

  db.query(query, [lead_ids], (err, result) => {
    if (err) {
      console.error("Error deleting lead: ", err);
      return res.status(500).send("Failed to delete lead");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Lead not found");
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  });
  console.log("This is lead Id", lead_ids);
};

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  //const email = "rahuldeploys@gmail.com";

  const [result] = await db
    .promise()
    .execute("SELECT * FROM users WHERE email = ?", [email]);

  // Check if no user is found with the provided email
  if (result.length === 0) {
    console.log("User does not exist");
    res.status(404).send("User does not exist");
  }

  // Generate a new 5-digit code
  const code = Math.floor(10000 + Math.random() * 90000);

  // Set expiration time to 3 minutes from now
  const expirationTime = new Date().getTime() + 3 * 60 * 1000; // 3 minutes in milliseconds

  // Update the existing record in email_verification table for the same email
  db.execute(
    "UPDATE email_verification SET code = ?, expiration_time = ? WHERE email = ?",
    [code, expirationTime, email],
    (err, result) => {
      if (err) {
        console.log("Error Updating ", err);
        return res.send(err);
      }
      // If no record was updated (i.e., no existing entry for the email), insert a new record
      if (result.affectedRows === 0) {
        db.execute(
          "INSERT INTO email_verification (email, code, expiration_time) VALUES (?, ?, ?)",
          [email, code, expirationTime],
          (err) => {
            if (err) {
              console.log("Error Updating ", err.message);
              return res.send(err.message);
            }

            sendVerificationEmail(email, code, res);
          }
        );
      } else {
        sendVerificationEmail(email, code, res);
      }
    }
  );
};

const sendVerificationEmail = (email, code, res) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}. It will expire in 3 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending mail ", err);
      return res.send(err.message);
    }
    console.log("This is info of transporter", info);
    return res.status(200).send("Code sent successfully");
  });
};

const verifyCodeAndUpdatePassword = (req, res) => {
  //console.log("This is request body",req.body)
  const { email, enteredCode } = req.body;
  // Check if the code exists and is not expired
  db.execute(
    "SELECT * FROM email_verification WHERE email = ? AND code = ?",
    [email, enteredCode],
    (err, result) => {
      if (err) {
        console.log("Error in matching email and code in DB", err);
        return res.send(err);
      }
      console.log("rhids is the desired result", result);

      if (result.length === 0) {
        console.log("Invalid or Expired Code");
        return res.send("Invalid or expired code");
      }

      const verificationData = result[0];

      // Check if the code has expired
      if (new Date().getTime() > verificationData.expiration_time) {
        res.status(404).send("Code has been expired");
        console.log("Expired Code");
      } else {
        res.status(200).send("Valid Code");
        console.log("Valid Code");
      }

      // Hash the new password using bcrypt and SECRET_KEY
      /* bcrypt.hash(
        newPassword,
        process.env.SECRET_KEY,
        (err, hashedPassword) => {
          if (err) {
            console.log("Error hashing password", err);
            return res.send(err);
          }

          // Update the user's password in the database
          db.execute(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email],
            (err) => {
              if (err) {
                console.log("Error in Updating Password", err);
                return res.send(err);
              }
              return res.send("Password updated successfully");
            }
          );
        }
      ); */
    }
  );
};

const updatePassword = async (req, res) => {
  // Hash the new password using bcrypt and SECRET_KEY
  const { newPassword, email } = req.body;
  /* bcrypt.hash(newPassword, process.env.SECRET_KEY, (err, hashedPassword) => {
    if (err) {
      console.log("Error hashing password", err);
      return res.send(err);
    }*/

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(newPassword, salt);
  console.log("This is the password", hashedPassword);

  // Update the user's password in the database
  db.execute(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, email],
    (err, result) => {
      if (err) {
        console.log("Error in Updating Password", err);
        //return res.send(err);
      }
      console.log("This is password update result", result);
      return res.send("Password updated successfully");
    }
  );
};

export {
  login,
  addUser,
  getAllLeads,
  addLead,
  editLead,
  deleteLead,
  assignLead,
  getAllUsers,
  sendVerificationCode,
  verifyCodeAndUpdatePassword,
  updatePassword,
};
