const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../module/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.signupPage)
.post(wrapAsync(userController.signupUser)); //signup

//loginPage
router.route("/login")
 .get(userController.loginPage )
 .post(                         //loginComplete
  saveRedirectUrl,
  passport.authenticate("local", {  //actule login from here
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginCompl
);

// logout
router.get("/logout",userController.logout)

module.exports = router;
