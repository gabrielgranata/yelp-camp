var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    flash           = require('connect-flash'),
    User            = require('./models/user'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override');
    seedDB          = require('./seeds');

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    authRoutes          = require('./routes/index');


//connect mongoose
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/'
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});

//for parsing in POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());
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
app.use(methodOverride('_method'));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//adds current user to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


let port = process.env.PORT || '3000';
let ip = process.env.IP || '127.0.0.1';

app.listen(port, function(){
    console.log("Server has started .... at port "+ port+" ip: "+ip);
});