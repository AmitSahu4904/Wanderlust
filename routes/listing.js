const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const {listingSchema} =require("../schema.js");
const expresserror = require("../utils/expresserror.js");
const Listing = require("../models/listing.js");

//validation listing 
const validatelisting = (req,res,next)=>{
let {error} = listingSchema.validate(req.body);
if(error){
  let errmsg = error.details.map((el)=> el.message).join(",");
  throw new expresserror(400,errmsg);

}
else{
  next();
}
};





//Index Route
router.get("/", wrapAsync(async (req, res) => {
   const alllistings = await Listing.find({});
res.render("listings/index.ejs" , {alllistings});
   
}));

//new route
router.get("/new" ,(req,res)=>{
 res.render("listings/new.ejs");
});


// show route
router.get('/:id',  wrapAsync(async (req ,res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error" , "listing do you requested does not exiest!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs" , {listing}); 
}));




// create route
router.post("/",validatelisting , wrapAsync( async (req, res,next) => {
    const newlisting = new Listing(req.body.listing);
   await newlisting.save();
   req.flash("sucess" , " new listing created");
   res.redirect("/listings");
  }));
  
  //edit route
  router.get("/:id/edit", wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error" , "listing do you requested does not exiest!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs" ,{listing});
  }));

  //update route
  router.put("/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
      throw new expresserror(400 , "send valid data for listing");
    }
   let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("sucess" , " listing updated");
   res.redirect(`/listings/${id}`);
  }
  ));
  


//delete route

  router.delete("/:id",wrapAsync(async (req,res)=>{
    let{id} = req.params;
    req.flash("sucess" , " listing deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }));
  
  
  
module.exports = router;


