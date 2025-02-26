const express = require("express");
const router = express.Router();
const { userSchema } = require("../schema.js");
const User = require("../models/model1.js");

const validateSchema = (req, res, next) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw errMsg;
  } else {
    next();
  }
};

router.get("/", (req, res) => {
  res.render("listings/SignUp.ejs");
});

router.post("/", validateSchema, async (req, res) => {
  try {
    let { email, password, copassword } = req.body;

    if (password !== copassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    let newUser = new User({
      email: email,
      password: password,
      created_at: new Date(),
    });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "There was an error saving the user" });
  }
});

module.exports = router;
