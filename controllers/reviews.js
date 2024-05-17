const Review = require("../module/reviews.js");
const Listing = require("../module/listeing.js");   

module.exports.create = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id) // wo ye listing h
    let newReview = new Review(req.body.Review);
    newReview.author = req.user.id;
    listing.reviews.push(newReview);// reviews :jo schema me define h vo array or listing jo h
   
    await newReview.save();
    await listing.save();  //if any change occur in existing database then save() it
    req.flash("success","Reviews Added")
    res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listing/${id}`);
};