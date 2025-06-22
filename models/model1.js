const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema = new Schema({
  email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
  },
  joinHost: {
    type: Boolean,
    default: false, // or true, depending on your logic
    required: false,
  },
  
  // password: {
  //   type: String,
  //       required: true,
  //       minlength: 8,
  // },

  created_at:{
    type:Date
},
firmCount: {
  type: Number,
  default: 0
},
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);