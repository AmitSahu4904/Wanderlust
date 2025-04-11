const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapasync.js");
const expresserror = require("./utils/expresserror.js");
const {listingSchema} =require("./schema.js");
const {reviewSchema} =require("./schema.js");
const review = require("./models/review.js");

const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");




main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionoptions  ={
  secret: "mysupersecretstring" ,
  resave: false , 
  saveUninitialized: true,
  cookie: {
    expire : Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly : true
  }

};


app.use(session(sessionoptions));
app.use(flash());

app.use((req,res,next)=>
{
  res.locals.sucess =req.flash("sucess");
  res.locals.error = req.flash("error");
  next();
})




app.get("/", (req, res) => {
  res.send("Hi, I am root");
});



app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);

 

app.all("*" ,(req,res,next)=>{
 next( new expresserror(404,"page do you find is not available"));
});


app.use((err,req,res,next)=>{
 let {statuscode =500 , message="page not found"} = err;

 res.status(statuscode).render("error.ejs", { message});

  // res.status(statuscode).send(message);
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});