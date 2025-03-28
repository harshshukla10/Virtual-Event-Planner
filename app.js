const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const User = require("./models/model1.js");
const dashData = require("./models/dashdata.js");
const EventData = require("./models/book.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const { userSchema } = require("./schema.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
  },
};
const flash = require('connect-flash');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const MONGO_URL = "mongodb://127.0.0.1:27017/VIRTUALPLANNER";
const signup = require("./routes/signup.js");
const login = require("./routes/login.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use("/SignUp", signup);
app.use("/login", login);

app.listen(port, () => {
  console.log(`Server is running on port 8080`);
});

app.get("/", (req, res) => {
  res.render("listings/index.ejs");
});

app.get("/demoUser",async (req,res)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"delta-student",
  });

  let registeredUser=await User.register(fakeUser,"helloworld");
  res.send(registeredUser);

});

app.get("/home", (req, res) => {
  res.render("listings/index.ejs");
});

app.get("/dashboard", async (req, res) => {
  const dashData1 = await dashData.find({});
  res.render("listings/dashboard.ejs", { dashData1 });
});

app.get("/dashboard/:id", async (req, res) => {
  try {
    let { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const listing = await dashData.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    res.render("listings/book.ejs", { listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/dashboard/:id", async (req, res) => {
  try {
    const event = new EventData(req.body);
    await event.save();
    res.redirect("/success");
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get("/success", (req, res) => {
  res.render("listings/success.ejs");
});
