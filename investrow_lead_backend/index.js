import express, { urlencoded } from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import routes from "./src/routes/index.js";
import nodemailer from "nodemailer";
import ejs from "ejs";
import moment from "moment-timezone";
import schedule from "node-schedule";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // Or specify your domain, e.g., 'https://yourdomain.com'
  })
);
app.use(express.json(urlencoded, true));

const PORT = process.env.PORT ;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: false,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
  console.log("Connected to the database as id " + db.threadId);
});

// Create reusable transporter
/* var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tdemo651@gmail.com",
    pass: "tedihyjmypzstvwq",
  },
  port: 465,
  host: "smtp.gmail.com",
}); */
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS,
  },
});

// Function to send email to both lead and user
async function sendEmail(lead, userEmail) {
  try {
    const followUpTime = moment.tz(lead.follow_up_date_time, "Asia/Kolkata");

    // Render the email template for the lead
    const leadEmailTemplate = await ejs.renderFile(
      path.join(__dirname, "email_template.ejs"),
      {
        lead_name: lead.full_name,
        follow_up_time: followUpTime.format("MMMM Do YYYY, h:mm a"),
      }
    );

    const leadMailOptions = {
      from: process.env.SENDER_EMAIL,
      to: lead.email_id,
      subject: "Follow-up Reminder",
      html: leadEmailTemplate,
    };

    // Render the email template for the user (assigned to follow up)
    const userEmailTemplate = await ejs.renderFile(
      path.join(__dirname, "user_email_template.ejs"),
      {
        user_name: lead.user_name,
        lead_name: lead.full_name,
        follow_up_time: followUpTime.format("MMMM Do YYYY, h:mm a"),
      }
    );

    const userMailOptions = {
      from: process.env.SENDER_EMAIL,
      to: userEmail,
      subject: "Lead Follow-up Reminder",
      html: userEmailTemplate,
    };

    await transporter.sendMail(leadMailOptions);
    console.log(`Email sent to lead: ${lead.email_id}`);

    await transporter.sendMail(userMailOptions);
    console.log(`Email sent to user: ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

// Function to get leads whose follow-up date is within the next two days
async function getLeadsTwoDaysLeft() {
  return new Promise((resolve, reject) => {
    const now = moment.tz("Asia/Kolkata");
    const twoDaysBeforeNow = now.clone().subtract(2, "days");
    const twoDaysFromNow = now.clone().add(2, "days");

    const query = `
      SELECT * FROM leads
      WHERE STR_TO_DATE(follow_up_date_time, '%Y-%m-%dT%H:%i') BETWEEN ? AND ?
    `;

    db.query(
      query,
      [
        twoDaysBeforeNow.format("YYYY-MM-DDTHH:mm"),
        twoDaysFromNow.format("YYYY-MM-DDTHH:mm"),
      ],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}

// Function to get the user's email based on the user_id from the users table
async function getUserEmailById(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT email FROM users WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0].email);
      } else {
        reject(new Error("User not found"));
      }
    });
  });
}

// Function to check and send emails to leads whose follow-up date is within the next two days
async function scheduleFollowUpEmails() {
  const leads = await getLeadsTwoDaysLeft();
  console.log("THESE ARE THE FOLLOW LEADS", leads);

  for (let lead of leads) {
    const followUpTime = moment(lead.follow_up_date_time).tz("Asia/Kolkata");
    const now = moment.tz("Asia/Kolkata");

    // Calculate the time for 2 days before follow-up
    const twoDaysBefore = followUpTime.clone().subtract(2, "days");

    // Schedule the email for two days before, every day at the same time
    const dailyReminderTime = twoDaysBefore
      .clone()
      .set("hour", followUpTime.hour())
      .set("minute", followUpTime.minute());
    /* console.log("This is daily reminder time", dailyReminderTime); */
    console.log("This is now time", now);

    console.log("This is daily reminder time", dailyReminderTime);
    console.log("This is follow time", followUpTime);

    const date = new Date(2024, 11, 23, 13, 30, 0);

    // Check if the two-day reminder email should be scheduled for the future
    if (
      dailyReminderTime.isSameOrBefore(followUpTime) &&
      now.hour() === dailyReminderTime.hour() &&
      now.minute() === dailyReminderTime.minute()
    ) {
      console.log("Inside two days reminder");
      // schedule.scheduleJob(dailyReminderTime.toDate(), async () => {
      /* schedule.scheduleJob(date, async () => { */
      const userEmail = await getUserEmailById(lead.user_id); // Get user email
      console.log("This is user eMAIL FROM follow up", userEmail);
      await sendEmail(lead, userEmail); // Send email to lead and user
      /* }); */
      console.log(
        `Scheduled daily email for 2 days before follow-up: ${lead.full_name}`
      );
    }
    /* 
    // Schedule the email for the exact follow-up time, once
    if (followUpTime.isAfter(now)) {
      console.log("Inside follow-up reminder");
      schedule.scheduleJob(date, async () => {
        const userEmail = await getUserEmailById(lead.user_id); // Get user email
        console.log("This is user eMAIL FROM follow up", userEmail);
        //await sendEmail(lead, userEmail); // Send email to lead and user
      });
      console.log(`Scheduled email for follow-up: ${lead.full_name}`);
    } */
  }
}

// Schedule the task to check and log leads every minute using node-schedule
schedule.scheduleJob("*/1 * * * *", async () => {
  console.log("Running scheduled job to send follow-up emails");
  await scheduleFollowUpEmails(); // Check and send follow-up emails every minute
});

app.use("/", routes);
