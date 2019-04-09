var express = require("express");
var router = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment  = require("../models/comment");
var middleware = require("../middleware/index");

//Comments new
router.get("/new",middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("./comments/new", {campground: campground});
        }
    });
    
});

//Create comments
router.post("/", middleware.isLoggedIn, function(req, res){
    //Lookup for the campground Id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                     req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                     req.flash("success", "Successfully comment is added");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
            
        }
    })
});

//Edit Comment Route

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "comment not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComments) {
      if(err){
          res.redirect("back");
      } else{
          res.render("comments/edit",{campground_id: req.params.id, comment: foundComments});
      } 
    });
    
        
    });
    
});

//Update Comment Route

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//Delete Comment Route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
             req.flash("success", "Comment deleted successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});




module.exports = router;