const user = require("../models/user.js");





module.exports.signupform = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup = async(req ,res)=>{
    try{
    
    let { username , email , password} = req.body;
    const newuser =  new user({email ,username});
    let registereduser = await  user.register(newuser , password);
    

        req.login(registereduser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("sucess" , "welcome to wanderlust ");
            res.redirect("/listings");
        });

  
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }


};


module.exports.loginform = (req ,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async(req, res)=>{
    req.flash(  "sucess" ,"welcome to wandurelast you are logged in ");
    let redirecturl = res.locals.redirecturl || "/listings" ;
    res.redirect(redirecturl);
};





module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("sucess" , " you are logged out !");
        res.redirect("/listings");
    });
};





