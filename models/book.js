const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventName: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
  },
  eventType: {
    type: String,
    enum: ["Wedding", "Conference", "Birthday Party", "Workshop", "Other"],
    required: [true, "Event type is required"],
  },
  eventDate: {
    type: Date,
    required: [true, "Event date is required"],
  },
  startTime: {
    type: String, // Storing time as a string (HH:MM format)
    required: [true, "Start time is required"],
  },
  attendees: {
    type: Number,
    required: [true, "Number of attendees is required"],
    min: [1, "At least 1 attendee is required"],
  },
  preferredVenue: {
    type: String,
    enum: [
      "Hotel",
      "Banquet Hall",
      "Outdoor Garden",
      "Virtual (Zoom, Google Meet)",
    ],
    required: [true, "Preferred venue is required"],
  },
  cateringRequired: {
    type: String,
    enum: ["Yes", "No"],
    required: [true, "Catering requirement is required"],
  },
  estimatedBudget: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: [true, "Budget estimate is required"],
  },
  paymentMode: {
    type: String,
    enum: ["UPI", "Card", "Cash", "Online Transfer"],
    required: [true, "Payment mode is required"],
  },
  specialPreferences: {
    type: String,
    trim: true,
  },
  needPlanner: {
    type: String,
    enum: ["Yes", "No"],
    required: [true, "Event planner preference is required"],
  },
});

module.exports = mongoose.model("EventData", eventSchema);
