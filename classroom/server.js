const express = require("express");
const app = express();
const session = require('express-session')
const flash = require('connect-flash');
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

const sessionOption = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
  };

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
   res.locals.success = req.flash("successMsg");
   res.locals.error = req.flash("errorMsg")
   next(); 
})

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if (name == "anonymous"){
        req.flash("errorMsg","user not register");
    }else{
        req.flash("successMsg","user registered sucessfull")
    }
    
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
   
   res.render("page.ejs",{name:req.session.name})
});



// app.get("/reqcount",(req, res)=>{
//     if (req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }

//     res.send(`the Count of request that You send ${req.session.count}`)
// })


// app.get("/test",(req,res)=>{
//     res.send("test successful!");
// })


app.listen(3000,()=>{
    console.log("server listening to 3000")
})