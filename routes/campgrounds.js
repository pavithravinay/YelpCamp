var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res) {
    //retrieve all campgrounds from db
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            req.flash("error", "error fetching campground");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/", {campgrounds: campgrounds, page: "campgrounds"});
        }
    });
});

//CREATE - add new campground and display all
router.post("/", middleware.isLoggedIn ,function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var createdDate = req.body.createdDate;
    var newCampground = {name: name, image: image, description: description, price: price, author: author, createdDate: createdDate};
    
    // add new campground to db
    Campground.create(newCampground, function(err, campground) {
        if(err) {
            req.flash("error", "error adding a new campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully added a new campground");
            res.redirect("/campgrounds");
        }
    })
});

//NEW - display form to add new campground
router.get("/new", middleware.isLoggedIn ,function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - show the details of selected campground
router.get("/:id", function(req, res) {
    var campgroundId = req.params.id;
    Campground.findById(campgroundId).populate("comments").exec(function(err, campground) {
        if(err) {
            req.flash("error", "Error fetching campground");
            res.redirect("/campgrounds");
        } else {
            //find the campground with provided id and render show template
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

//EDIT - show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("back"); 
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});


//UPDATE - update campground and redirect to shoe page
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
        if(err) {
            req.flash("error", "Error updating campground");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE - delete campground and redirect
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // res.send("delete req");
    Campground.findByIdAndRemove(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Error deleting campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully deleted the campground");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
