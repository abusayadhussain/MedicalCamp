var Campground = require("../models/campground");
var Comment = require("../models/comment");
//All the middleware goes here

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res, next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground is not found");
                res.redirect("back");
            } else{
                //Does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                     req.flash("error", "You don't have permissions to do that");
                    res.redirect("back");
                }
                
            }
        });
    } else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
    
}   



middlewareObj.checkCommentOwnership = function(req,res, next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "comment not found");
                res.redirect("back");
            } else{
                //Does the user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                     req.flash("error", "You don't have permissions to comment here");
                    res.redirect("back");
                }
                
            }
        });
    } else{
         req.flash("error", "You need to looged in to comment");
        res.redirect("back");
    }
    
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "YOu need to be looged in to do that!");
    res.redirect("/login");
}
 

module.exports = middlewareObj;