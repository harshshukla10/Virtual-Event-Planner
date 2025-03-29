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
  let { username, email, password, copassword } = req.body;
  try {
    if (password !== copassword) {
      req.flash("error", "Password does not match");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to BookNHost");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

module.exports = router;
