const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
   const alllistings = await Listing.find({});
res.render("listings/index.ejs" , {alllistings});
   
};

module.exports.rendernewform = (req,res)=>{
    res.render("listings/new.ejs");
   };



   module.exports.showlisting = async (req ,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews" , populate : {
      path: "author"
    },
  }).populate("owner");
    if(!listing){
      req.flash("error" , "listing do you requested does not exiest!");
      res.redirect("/listings");
    }
 
    res.render("listings/show.ejs" , {listing}); 
  };



  module.exports.createListing = async (req, res,next) => {
      let url = req.file.path;
      let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
newlisting.image = {url , filename};

   await newlisting.save();
   req.flash("sucess" , " new listing created");
   res.redirect("/listings");
  };

module.exports.editlisting = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error" , "listing do you requested does not exiest!");
      res.redirect("/listings");
    }
   let originalurl =  listing.image.url;
    originalurl = originalurl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs" ,{listing ,originalurl});
  };



module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the listing by ID
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Update the listing fields
        Object.assign(listing, req.body.listing);

        // Handle file upload if present
        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            listing.image = { url, filename };
        }

        // Save the updated listing
        await listing.save();

        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while updating the listing");
        res.redirect(`/listings/${id}/edit`);
    }
};




   module.exports.deletelisting = async (req,res)=>{
    let{id} = req.params;
    req.flash("sucess" , " listing deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  };






