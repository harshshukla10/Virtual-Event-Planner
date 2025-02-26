const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dashDataSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:"https://media.istockphoto.com/id/2110310187/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=1024x1024&w=is&k=20&c=FfMY-QLqiixCQprNhrs5vmHZn1_vHqxKj3CWBRQsJ9M=",
    set: (v) =>
      v === ""
        ? "color.png"
        : v,
  },
});

module.exports = mongoose.model("dashdata", dashDataSchema);