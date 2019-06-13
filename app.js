var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//for parsing in POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
    {name: 'Salmon Creek', image: 'https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg'},
    {name: 'Granite Hill', image: 'https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg'},
    {name: 'Mountain Goat\'s Rest', image: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'},
    {name: 'Salmon Creek', image: 'https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg'},
    {name: 'Granite Hill', image: 'https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg'},
    {name: 'Mountain Goat\'s Rest', image: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'},
    {name: 'Salmon Creek', image: 'https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg'},
    {name: 'Granite Hill', image: 'https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg'},
    {name: 'Mountain Goat\'s Rest', image: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'}
];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){

    res.render('campgrounds', {campgrounds: campgrounds});

})

app.post('/campgrounds', function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {
        name: name,
        image: image
    }
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect('/campgrounds');
})

app.get('/campgrounds/new', function(req, res){
    res.render('new')
})

app.listen('3000', 'localhost', function() {
    console.log('The YelpCamp server has started');
})