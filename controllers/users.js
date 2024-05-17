const User = require("../module/user.js");

module.exports.signupPage =  (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser,(err)=>{  // automatically login when sign up
        if(err){
            return next(err)
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listing");
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };
  
module.exports.loginPage = (req, res) => {
    res.render("./users/login.ejs");
  };

module.exports.loginCompl = async (req, res) => {
    req.flash("success","Welcome back to Wanderlust")
    let redirect = res.locals.redirectUrl || "/listing" //to check it is undefine or not;
    res.redirect(redirect );
  };
module.exports.logout = (req,res,next)=>{
    req.logOut((err) =>{
        if(err){
            next(err);
        }else{
            req.flash("success","you are logged out!");
            res.redirect("/listing");
        }
    })
};