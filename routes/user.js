const express = require("express");
const router  =  express.Router();
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveredirecturl } = require("../middleware.js");

const usercontroller = require("../controller/users.js");


router.route("/signup")
.get( usercontroller.signupform)
.post(wrapasync(usercontroller.signup));

// app.get("/demouser" ,async(req,res)=>{
//     let fakeuser = new user({
//       email : "student@gmail.com",
//       username : " delta-user"
  
//     });
//      let registereduser =    await user.register(fakeuser , "helloworld");
//      res.send(registereduser);
//   });


router.route("/login")
.get(usercontroller.loginform)
.post(saveredirecturl, passport.authenticate("local" , { failureRedirect : "/login" ,failureFlash: true}),usercontroller.login);



router.get("/logout" ,usercontroller.logout);




module.exports = router ; 