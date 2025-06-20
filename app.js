if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log("ENV Loaded:", {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
}

require("dotenv").config();
const dbUrl = process.env.ATLASDB_URL;
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const multer = require("multer");
const HostData = require("./models/host-info.js");
const User = require("./models/model1.js");
const dashData = require("./models/dashdata.js");
const EventData = require("./models/book.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const { userSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION Store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
  },
};

const flash = require("connect-flash");
const { isLoggedIn } = require("./middleware.js");

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
  res.locals.currUser = req.user;
  next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
  await mongoose.connect(dbUrl);
}

app.use("/SignUp", signup);
app.use("/login", login);

app.listen(port, () => {
  console.log(`Server is running on port 8080`);
});

app.get("/", (req, res) => {
  res.render("listings/index.ejs");
});

app.get("/home", (req, res) => {
  res.render("listings/index.ejs");
});

app.get("/dashboard", isLoggedIn, async (req, res) => {
  const dashData1 = await dashData.find({});
  const dashBook = await EventData.find({ userId: req.user.username });
  res.render("listings/dashboard.ejs", { dashData1, dashBook });
});

app.get("/dashboard/:id", isLoggedIn, async (req, res) => {
  try {
    let { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const listing = await dashData.findById(id);
    if (!listing) {
      return req.flash("error", "Listing not found in DB");
    }

    res.render("listings/book.ejs", { listing });
  } catch (error) {
    req.flash("error", error.message);
  }
});

app.post("/dashboard/:id", isLoggedIn, async (req, res) => {
  try {
    // Attach the logged-in user's email or ID to the booking data
    const event = new EventData({
      ...req.body,
      userId: req.user.username, // or userId: req.user._id if you use IDs
    });
    await event.save();
    res.redirect("/success");
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out !");
    res.redirect("/home");
  });
});

app.get("/success", isLoggedIn, (req, res) => {
  res.render("listings/success.ejs");
});

app.get("/hostdash", isLoggedIn, (req, res) => {
  res.render("./listings/hostdash.ejs");
});

app.get("/hostSignup", (req, res) => {
  res.render("./listings/host-signup.ejs");
});

app.post("/hostSignup", (req, res) => {});

app.get("/dash-data", isLoggedIn, async (req, res) => {
  const dashHost = await HostData.find({});
  const dashBook1 = await EventData.find({});
  res.render("./listings/dash-data.ejs", { dashHost, dashBook1 });
});

app.get("/host-info", isLoggedIn, (req, res) => {
  res.render("./listings/host-info.ejs");
});

app.post(
  "/host-info",
  upload.fields([
    { name: "listing[profilePicture]", maxCount: 1 },
    { name: "listing[eventPhotos]", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const profilePicture = req.files["listing[profilePicture]"]
        ? req.files["listing[profilePicture]"][0].path
        : null;

      const eventPhotos = req.files["listing[eventPhotos]"]
        ? req.files["listing[eventPhotos]"].map((file) => file.path)
        : [];

      console.log("Files received:", req.files);

      const eventData = {
        ...req.body,
        profilePicture,
        eventPhotos,
      };

      const event1 = new HostData(eventData);
      await event1.save();
      res.redirect("/success");
    } catch (err) {
      console.error("Error saving host info:", err);
      res.status(500).send("Something went wrong");
    }
  }
);

app.get("/success", isLoggedIn, (req, res) => {
  res.render("./listings/success.ejs");
});

app.post('/accept/:id', async (req, res) => {
  console.log('POST /accept/:id called with', req.params.id);
  try {
    const booking = await EventData.findById(req.params.id);
    if (!booking) {
      console.log('Booking not found');
      return res.json({ success: false, message: "Booking not found." });
    }
    booking.status = 'accepted';
    await booking.save();
    console.log('Booking accepted:', booking._id);
    res.json({
      success: true,
      customerContact: booking.customerContact,
      message: "Booking successfully accepted!"
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "An error occurred." });
  }
});