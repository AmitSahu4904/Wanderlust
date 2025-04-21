const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapasync.js");


const {validatereview, isloggedin, isreviewauthor} = require("../middleware.js");

const reviewcontroller = require("../controller/reviews.js");




// Review route
  
router.post("/" ,isloggedin,validatereview, wrapAsync(reviewcontroller.createreview));
  
  
  
  //delete review rout 
  router.delete("/:reviewid" ,isloggedin,isreviewauthor, wrapAsync(reviewcontroller.deletereview));
  

module.exports = router;

