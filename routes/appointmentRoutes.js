const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ✅ Use environment variables
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/appointments
router.post("/appointments", async (req, res) => {
  try {
    const { name, contact, help, date } = req.body;

    // Basic validation
    if (!name || !contact || !help || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to DB
    const newAppointment = new Appointment({ name, contact, help, date });
    await newAppointment.save();

    // Send Email
    // Convert date from yyyy-mm-dd to dd-mm-yyyy
    const formattedDate = date.split("-").reverse().join("-");

    const mailOptions = {
      from: "wellmind.ai.care@gmail.com",
      to: "shahinarasheed50@gmail.com",
      subject: "📅 New Appointment Scheduled",

      text: `

A new appointment has been scheduled. Here are the details:


👤 Name           : ${name}
📝 Help Needed    : ${help}
📅 Appointment Date : ${formattedDate}
📞 Contact Number : ${contact}


Please follow up with the client as needed.

Best regards,  
WellMind Appointment System
`.trim(),
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email Error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({ message: "Appointment saved and email sent" });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetch", async (req, res) => {
  console.log("📥 Incoming GET request to /fetch");

  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    console.log(`✅ Retrieved ${appointments.length} appointments from DB`);

    res.json(appointments);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// PATCH /api/appointments/:id/status
router.patch("/appointments/:id/status", async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Status updated", appointment: updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
