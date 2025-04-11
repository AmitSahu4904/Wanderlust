const express = require("express");
const router = express.Router();




//index posts
router.get("/",(req,res)=>{
    res.send("get for post  ");
});


//show posts  
router.get("/:id" ,(req,res)=>{
    res.send("get for show  post");
});

//post posts  
router.post("/" ,(req,res)=>{
    res.send("post for    post  ");
});



//delete posts 
router.delete("/:id" ,(req,res)=>{
    res.send("delete for    post ");
});

module.exports = router ;
