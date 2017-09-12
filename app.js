var seedDB                = require("./seeds"),
    express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    Comment               = require("./models/comment"),
    Campground            = require("./models/campground"),
    passportLocalMongoose = require("passport-local-mongoose");
    
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
  
mongoose.connect(process.env.DATABASEURL, {useMongoClient: true}); 
// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true}); 
// mongoose.connect("mongodb://pvinay:Password@ds153113.mlab.com:53113/pvinay_yelpcamp", {useMongoClient: true}); 


//app CONFIG
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

//passport CONFIG
app.use(require("express-session")({
    secret: "My name is pavi",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success     = req.flash("success");
    res.locals.error       = req.flash("error");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started");
});