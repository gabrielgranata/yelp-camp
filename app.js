var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

//connect mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true });
//for parsing in POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
seedDB();  

app.get('/', function (req, res) {
    res.render('landing');
});

//INDEX - display list 
app.get('/campgrounds', function (req, res) {
    //get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds }); // uses found campgrounds from database
        }
    })
})

//CREATE - post new campground
app.post('/campgrounds', function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description
    }
    //Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    })
})

//NEW - show form to create new campground
app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new')
})

//SHOW - shows info about one specific campground
app.get('/campgrounds/:id', function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render the show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
})

// ==============
// COMMENT ROUTES
// ==============

app.get('/campgrounds/:id/comments/new', function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});      
        }
    })
});

app.post('/campgrounds/:id/comments', function(req, res){
    //lookup campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground show page
})

app.listen('3000', 'localhost', function () {
    console.log('The YelpCamp server has started');
})