var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root route
router.get("/", function(req, res){
    res.render("landing");
});

//Show sign up form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle signup logic

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    var newUserPassword = req.body.password;
    User.register(newUser, newUserPassword, function(err, user){
      if(err){
            req.flash("error", err.message);
            res.redirect("register");
          
      }  
      passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to MedicalCamp "+user.username);
         res.redirect("/campgrounds"); 
      });
    });
});

//Show login form

router.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }),function(req, res) {
    
});

//logout route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success", "Looged you out");
    res.redirect("/campgrounds");
});



module.exports = router;