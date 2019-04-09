var express = require("express");
var router = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware/index");

//Index Route
router.get("/", function(req, res){
    //Get all the campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("./campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
    
});


//Create Route
router.post("/",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name: name, price: price, image:image, description:desc, author: author};
    
    //Create a new campground and save it to the database
    Campground.create(newCampGround, function(err, newCampGround){
        if(err){
            console.log(err);
        }else{
           res.redirect("/campgrounds"); 
        }
    });
    
});

//New route
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("./campgrounds/new");
});

//Show Route
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            console.log(foundCampground);
             res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
   
});

//Edit Campgorund Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
             req.flash("error", "Campground is not found");
            res.render("campgrounds/edit", {campground: foundCampground});
        });
    });
//Update Campground Route

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/camgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete Campground Route

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});





module.exports = router;