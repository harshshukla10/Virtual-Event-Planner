const mongoose = require("mongoose");

const eventHostSchema = new mongoose.Schema({
  // Basic Info
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, 
    required: true,
  },
  socialLinks: {
    type: String,
    required: false,
  },

  // Business & Service Details
  firmName: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: Number, // Assuming PIN code
    required: true,
  },
  serviceArea: {
    type: String,
    enum: ["Local", "National", "International"],
    required: true,
  },

  // Listing / Portfolio Info
  eventPhotos: [
    {
      type: String, // Array of filenames or URLs
      required: true,
    },
  ],
  testimonials: {
    type: String,
    required: true,
  },
  packages: {
    type: String,
    required: true,
  },
  terms: {
    type: String,
    required: true,
  },

  // Optional / Advanced Info
  registrationNumber: {
    type: String,
    required: true,
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1,
  },
  customServices: {
    type: String,
    required: true,
  },
  languagePreferences: {
    type: String,
    required: true,
  },
  paymentMethods: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
  },
  
});

module.exports = mongoose.model("EventHost", eventHostSchema);
