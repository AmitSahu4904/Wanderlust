const express = require("express");
const app = express();
const  users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session  = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionoption = {secret: "mysupersecretstring" ,resave: false , saveUninitialized: true,};


app.use(session(sessionoption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucess  = req.flash("sucess");
    res.locals.error = req.flash("err");
    next();
});



app.get("/register" ,(req,res)=>{

let {name = "unknown"} = req.query;
req.session.name = name;
console.log(req.session.name);
if(name === "unknown"){
    req.flash("err" , "user not found");
}else{
    req.flash("sucess" , "user registered sucessfully ");

}
res.redirect("/hello");
});

app.get("/hello" ,(req,res)=>{
    res.locals.sucess= req.flash("sucess");
    res.locals.error = req.flash("err");
    res.render("page.ejs" , {name: req.session.name ,msg :req.flash("sucess")});
});





// app.get("/recount" ,(req,res)=>{
   
//    if(req.session.count){
//      req.session.count++;
//    }
//    else{
       
//        req.session.count = 1;
//    }

//     res.send(`you sent a request ${req.session.count} times `);
// });


// app.get("/test" ,(req,res)=>{
//     res.send("test sucessfull ");
// })





app.listen(3000 , (req,res)=>{
    console.log("server is listing to 3000");
});
















// const cookieparser = require("cookie-parser");

// app.use(cookieparser("secretekey"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("madein" , "india" ,{signed: true});
//     res.send("signed cookies send ");
// });

// app.get("/verify" ,(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verify");
// }); 

// app.get("/getcookie" ,(req,res)=>{
//     res.cookie("greet", "hello ");
//     res.cookie("name" , "amit");
//     res.send("sent you some cookie");
// });

// app.get("/greet" ,(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`hello ${name}`);

// })

// app.get("/" ,(req,res)=>{
//     console.dir(req.cookies);
//     res.send("hii i am root ");
// });

// //user rout
// app.use("/users" , users);


// //post rout
// app.use("/posts" , posts  );




