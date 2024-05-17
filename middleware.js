const Listing = require("./module/listeing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./module/reviews.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create the listing!");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;  //session store into locals not give undefine
    }
    next();
}
module.exports.isOwner = async(req,res,next)=>{   //to give the access to edit the paticular listing to the owner
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)){ //check to owner and currentUser to backend side
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {   //handle the error 'Schema' type error and validation Error
    let { error } = listingSchema.validate(req.body);
  
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");  //Extra error message and details which is seprated by comma;
      throw new ExpressError(400, errMsg);
    }
    else {
      next();
    }
  }

module.exports.validateReview = (req, res, next) => {   //handle the error 'Schema' type error and validation Error
    let { error } = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");  //Extra error message and details which is seprated by comma;
      throw new ExpressError(400, errMsg);
    }
    else {
      next();
    }
  }

  module.exports.isreviewAuthor = async(req,res,next)=>{ //to give the delete access to the author
    let { id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)){ 
        req.flash("error","you are not author of this reviews");
        return res.redirect(`/listing/${id}`);
    }
    next();
}