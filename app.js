
if(process.env.NODE_ENV != " production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");




const dburl = process.env.ATLASDB_URL;



const expresserror = require("./utils/expresserror.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');



const flash = require("connect-flash");

const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
  mongoUrl: dburl,
 crypto: {
  secret: process.env.SECRET,
 },
touchAfter:24*3600,

});

store.on("error", function (e) {
  console.log("session store error", e);
}
);

const sessionoptions  ={
  store,
  secret: process.env.SECRET,
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


// passport use session 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



// middleware
app.use((req,res,next)=>
{
  res.locals.sucess =req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});





app.use("/listings", listingrouter);
app.use("/listings/:id/reviews" , reviewrouter);
app.use("/" , userrouter);

 








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