const express = require("express");
const router = express.Router();
const Listing = require("../module/listeing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfi.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //listing route to list of data route;
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.create)
  ); //create route:

//Create the new route:
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show the listed data in detail route;
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  ) //update the data which is coming from edit;
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)); //deleting the route;

//edit the data render to edit file:
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
