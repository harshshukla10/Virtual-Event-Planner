const express = require("express");
const router = express.Router();
const User = require("../models/model1.js");
const { userSchema } = require("../schema.js");
const passport = require("passport");
router.get("/", (req, res) => {
  res.render("listings/login.ejs");
});

const validateSchema = (req, res, next) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw errMsg;
  } else {
    next();
  }
};

router.post("/",passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}) ,async (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;
