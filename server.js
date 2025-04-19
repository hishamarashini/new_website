const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express(); // ← this was missing!
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Your contact POST route goes here:
app.post('/contact', async (req, res) => {
  const { firstname, lastname, email, subject } = req.body;

  console.log("Form data received:", { firstname, lastname, email, subject });

  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `Contact Form from ${firstname} ${lastname}`,
    text: subject
  };

  try {
    console.log("Attempting to send email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).send('Message sent!');
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send('Error sending email.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
