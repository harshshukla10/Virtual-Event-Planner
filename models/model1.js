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
  
  
  // password: {
  //   type: String,
  //       required: true,
  //       minlength: 8,
  // },

  created_at:{
    type:Date
}
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);