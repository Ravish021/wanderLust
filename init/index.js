const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../module/listeing.js");
const { init } = require("../module/reviews.js");

main()
  .then((res) => {
    console.log("successful connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Project");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"65fbe05b70a960ec53b48ea6"}));  //to give the owner of listing;
    await Listing.insertMany(initData.data)  //here 'initData' is object so we have to access the key Data.
    console.log("data was initialized")
}
initDB();