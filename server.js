require('dotenv').config();
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to handle form
app.post('/contact', async (req, res) => {
  const { firstname, lastname, email, subject } = req.body;

  // Set up transporter
  let transporter = nodemailer.createTransport({
    service: 'Outlook', // or use SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  // Email options
  let mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL_TO,
    subject: `Contact Form from ${req.body.lastname}`,
    text: req.body.subject
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
