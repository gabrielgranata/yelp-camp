var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

//connect mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true });
//for parsing in POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//schema setup

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({ name: 'Mountain Goat\'s Rest', image: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg', description: 'This is a lovely' }, function (err, campground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('NEW CREATED CAMPGROUND:');
//         console.log(campground);
//     }
// })

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
            res.render('index', { campgrounds: allCampgrounds }); // uses found campgrounds from database
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
    res.render('new')
})

//SHOW - shows info about one specific campground
app.get('/campgrounds/:id', function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render the show template with that campground
            res.render('show', {campground: foundCampground});
        }
    });
})

app.listen('3000', 'localhost', function () {
    console.log('The YelpCamp server has started');
})