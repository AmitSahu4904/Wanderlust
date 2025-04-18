
const Listing = require("./models/listing");
const {listingSchema} =require("./schema.js");
const expresserror = require("./utils/expresserror.js");
const {reviewSchema} =require("./schema.js");
const Review = require("./models/review.js");

module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;
        req.flash("error" , "you might be loggedin to create listing");
       return res.redirect("/login");
      }
     next(); 
}


module.exports.saveredirecturl = (req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
};


module.exports.isowner = async(req,res,next)=>{

    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
      req.flash("error" , "you have not permission to edit ");
     return  res.redirect(`/listings/${id}`);
    }
 next();
};


//validation listing 
module.exports.validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el)=> el.message).join(",");
      throw new expresserror(400,errmsg);
    
    }
    else{
      next();
    }
    };



//validate review 
module.exports.validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el)=> el.message).join(",");
      throw new expresserror(400,errmsg);
    
    }
    else{
      next();
    }
    };
    

    module.exports.isreviewauthor = async(req,res,next)=>{

      let {id, reviewid} = req.params;
      let review = await Review.findById(reviewid);
      if(!review.author._id.equals(res.locals.curruser._id)){
        req.flash("error" , "you did not created this review  ");
       return  res.redirect(`/listings/${id}`);
      }
   next();
  };

