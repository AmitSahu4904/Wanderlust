const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");

const {isloggedin , isowner , validatelisting} = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");

const multer  = require('multer');
const {storage} =require("../cloudconfig.js");
const upload = multer({ storage });



//new route
router.get("/new" ,isloggedin,listingcontroller.rendernewform);



router
.route("/")
.get( wrapAsync(listingcontroller.index))
 .post(isloggedin,upload.single('listing[image]'),validatelisting , wrapAsync( listingcontroller.createListing));


router.route("/:id")
.get(  wrapAsync(listingcontroller.showlisting))
.put(isloggedin,isowner,upload.single('listing[image]'),validatelisting,wrapAsync( listingcontroller.updatelisting ))
.delete(isloggedin,isowner,wrapAsync( listingcontroller.deletelisting));




  //edit route
  router.get("/:id/edit",isloggedin,isowner, wrapAsync(listingcontroller.editlisting));


  
module.exports = router;


