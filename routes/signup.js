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
  res.render("listings/signup.ejs");
});

router.post("/", validateSchema, async (req, res, next) => {
  let { username, email, joinHost, password, copassword } = req.body;
  console.log(req.body);

  try {
    if (password !== copassword) {
      req.flash("error", "Password does not match");
      return res.redirect("/signup");
    }

    // Ensure joinHost is a boolean (checkbox sends "on" or "true")
    const isJoiningAsHost = joinHost === "true" || joinHost === "on";

    const newUser = new User({ email, username, joinHost: isJoiningAsHost });
    const registeredUser = await User.register(newUser, password);

    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to BookNHost");

      if (isJoiningAsHost) {
        return res.redirect("/dash-data");
      } else {
        return res.redirect("/dashboard");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});


module.exports = router;
