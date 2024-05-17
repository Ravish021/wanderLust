const Listing = require("../module/listeing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/Geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken});



module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing })
}


module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const find = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner"); //populate() show all the detailed of review with author and owner of listings
    if (!find) {
        req.flash("error", "Listing you request for does not exits!");
        res.redirect("/listing");
    }
    res.render("./listing/show.ejs", { find });
};

module.exports.create = async (req, res, next) => {
    // let location = req.body.listing.location
    // console.log(location)
    let response = await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1
      }).send()
        

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); //instance
    newListing.owner = req.user._id;  //add the by default owner id;
    newListing.image = { url, filename } //add the uploaded image url and file name
    newListing.geometry = response.body.features[0].geometry;  //add the coordinates 
    let saveListing = await newListing.save();
    console.log(saveListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const find = await Listing.findById(id);
    if (!find) {
        req.flash("error", "Listing you request for does not exits!");
        res.redirect("/listing");
    }

    let originalImageUrl = find.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listing/edit.ejs", { find, originalImageUrl });
};

module.exports.update = async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing");
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "New listing Update!")
    res.redirect(`/listing/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing")
}