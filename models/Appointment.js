const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    help: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["attended", "not attended"],
      default: "not attended",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
