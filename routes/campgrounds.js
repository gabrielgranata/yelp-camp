var express = require('express');
var router = express.Router();

var Campground  = require('../models/campground'),
    Comment     = require('../models/comment');

var middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        price: price,
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
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new')
})

//SHOW - shows info about one specific campground
router.get('/:id', function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            res.redirect('/campgrounds');
            console.log(err);
        } else {
            //render the show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT - edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE - updates the route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DELETE - deletes the campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    // find and delete the correct campground
    Campground.findByIdAndRemove(req.params.id, function(err, removed){
        if(err){
            res.redirect('/campgrounds');
        } else {
            Comment.deleteMany({_id: {$in: removed.comments}}, function(err){
                if(err){
                    res.redirect('/campgrounds');
                } else {
                    res.redirect('/campgrounds');
                }
            })
        }
    })
})

module.exports = router;