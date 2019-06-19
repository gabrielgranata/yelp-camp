var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    seedDB          = require('./seeds');

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    authRoutes          = require('./routes/index');


//connect mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true });
//for parsing in POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// seedDB();  // seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'Campground Secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//adds current user to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen('3000', 'localhost', function () {
    console.log('The YelpCamp server has started');
})