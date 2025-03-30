const mongoose=require("mongoose");
const initData=require("./dashdata-img.js");
const Listing=require("../models/dashdata.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/VIRTUALPLANNER";


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

const initDB=async()=>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({ ...obj,owner:'67e85288793ad53516366861'}));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
};

initDB();