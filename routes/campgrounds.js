var express = require('express');
var router = express.Router();

var Campground = require('../models/campground');

//INDEX - display list 
router.get('/', function (req, res) {
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
router.post('/', isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
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
router.get('/new', isLoggedIn, function (req, res) {
    res.render('campgrounds/new')
})

//SHOW - shows info about one specific campground
router.get('/:id', function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render the show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;