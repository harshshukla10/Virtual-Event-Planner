const express = require("express");
const router = express.Router();
const User = require("../models/model1.js");
const { userSchema } = require("../schema.js");
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

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password!" });
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
