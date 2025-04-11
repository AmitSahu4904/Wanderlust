const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const {listingSchema} =require("../schema.js");
const {reviewSchema} =require("../schema.js");
const reviews = require("../routes/review.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



//validate review 
const validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el)=> el.message).join(",");
      throw new expresserror(400,errmsg);
    
    }
    else{
      next();
    }
    };
    


// Review route
  
router.post("/" ,validatereview, wrapAsync(async(req,res)=>{
  
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("sucess" , " new review created");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  
  
  //delete review rout 
  router.delete("/:reviewid" , wrapAsync(async(req,res)=>{
  
  let {id ,reviewid} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{ reviews: reviewid}});
  await Review.findByIdAndDelete(reviewid);
  
  req.flash("sucess" , " review deleted");
  
  res.redirect(`/listings/${id}`);  
  
  }));
  

module.exports = router;

