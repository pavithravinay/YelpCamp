var middlewareObj = {};
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //check if the user is logged in
    if(req.isAuthenticated()) {
        //check if the user is the owner of the campground (the one who added it)
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "campground not found!");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else { //if not the./mongo owner
                    req.flash("error", "You do not have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else { //if not logged in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    //check if the user is logged in
    if(req.isAuthenticated()) {
        //check if the user is the owner of the comment (the one who added it)
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else { //if not the owner
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else { //if not logged in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;