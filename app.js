if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// const Listing = require("./module/listeing.js");
const methodOverring = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js")
// const Review = require("./module/reviews.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require("./module/user.js");

const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/reviews.js");
const userRouter = require("./route/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const dbURL = process.env.ATLASDB_URL;
main()
  .then((res) => {
    console.log("successful connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbURL);
};

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))  //pass the data from url;
app.use(methodOverring("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("Error in mongo session store:", err);
});

const sessionOption = {
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 *24 *60 *60 *1000,  //expire set to 1 weak
    maxAge:7 *24 *60 *60 *1000,
    httpOnly:true,
  }
};


//root route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root node");
// });


app.use(session(sessionOption));  
app.use(flash());            

app.use(passport.initialize());       // A middleware that initializes passport
app.use(passport.session());          //A web application needs the ability  to identify users as the they browse from page to page 
                                      // The seriese of request and responnse ,each associated with same user in knows as session.

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  // use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fackuser = new User({
//     email:"user@gmail.com",
//     username:"apple-with_google",
//   });
//   let registerUser = await User.register(fackuser,"hello12");
//   res.send(registerUser);
// });


app.use("/listing", listingRouter);             //use the listings where (/listing) //require the all listing route from listing.js
app.use("/listing/:id/review",reviewRouter);
app.use("/",userRouter);

//if route does't exits
app.all("*",(req, res, next) => {//if any error are there, this will be executed
  next(new ExpressError(404, "Page not found!"));
});

//middleware to handle the error 
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });

})

app.listen(8080, () => {
  console.log("server listening port 8080");
})