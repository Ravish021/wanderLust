const express = require("express");
const router = express.Router({mergeParams:true});  //mergeParams:true means to send the id to child routes;
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview, isreviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//reviews route:
router.post("/", validateReview, isLoggedIn,wrapAsync(reviewController.create));

//delete reviews :
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(reviewController.delete))

module.exports = router;