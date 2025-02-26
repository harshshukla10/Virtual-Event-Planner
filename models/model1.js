const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
  },
  
  
  password: {
    type: String,
        required: true,
        minlength: 8,
  },

  created_at:{
    type:Date
}
});

module.exports = mongoose.model("model1", userSchema);