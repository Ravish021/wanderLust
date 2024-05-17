const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    
    Comment:{
        type:String,
        // required:true,
    },
    rating:{
        type:Number,
        max:5,
        min:0,
        
    },
    createdAT:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

module.exports = mongoose.model("Review",reviewSchema);