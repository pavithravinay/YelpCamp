var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

//Comments - new
router.get("/new", middleware.isLoggedIn,  function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "error fetching campground");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments - create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "error fetching campground");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "error adding comment");
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(function(err) {
                        if(err) {
                            req.flash("error", "error saving campground");
                            res.redirect("/campgrounds/" + campground._id );
                        } 
                    });
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id );
                }
            });
        }
    });
});

//EDIT Route - display edit form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

//UPDATE Route - update comment and redirect
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err) {
            req.flash("error", "error updating comment")
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//DESTROY - delete comment and redirect
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if(err) {
            req.flash("error", "Error deleting comment");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;