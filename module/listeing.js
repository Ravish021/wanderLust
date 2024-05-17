const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js")

const listeningSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename:String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
    default: "India",
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

//if listing is deleted then all reveiws has been deleted
listeningSchema.post("findOneAndDelete",async(listing)=>{// using pre and post
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})
const Listing = new mongoose.model("Listing", listeningSchema);

module.exports = Listing; 
