// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema   = mongoose.Schema;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



const movieSchema = new mongoose.Schema({
  title : String,
  year  : String,
  director: String,
  duration: String,
  genre: [String],
  rate : String
});

const Movie = mongoose.model('Movie', movieSchema);

app.get('/movies', function (req, res) {
  Movie.find()
  .then(movies => {
    let data = {};
    data.theList = movies;
    res.render('index', data)
  })
  .catch(theError => { console.log(theError) })
})


app.get('/movies/new', function (req, res) {
  res.render('createMovie')
})

app.post('/movies/create', function (req, res) {
console.log("req body", req.body);

const theActualTitle = req.body.theTitle;
const theActualDirector = req.body.theDirector;
const theActualYear = req.body.theYear;
const theActualRate = req.body.theRate;

const newMovie = new Movie({
title : theActualTitle,
director: theActualDirector,
year  : theActualYear,
rate: theActualRate
})
console.log("about to save new movie!!")
newMovie.save()
.then(movie => {
console.log("Saved  moveie!")
console.log(movie)
})
.catch(theError => { 
  console.log(theError) 
  assert.isNotOk(error,'Promise error');
})

res.redirect('/movies')
});

app.get('/movies/edit/:id', function (req, res) {
  Movie.findById(req.params.id)
  .then(theMovie =>{
    res.render('editMovie', {movie: theMovie})
  })
  res.redirect('/movies')
});

app.post('/movies/update/:id', function (req, res) {
Movie.findByIdAndUpdate(req.params.id, {
  title: req.body.title,
  director: req.body.director,
  year: req.body.year,
  rate: req.body.rate
})
.then(movie => {
  console.log(movie);
})
.catch(theError => { console.log(theError) })
res.redirect('/movies')
});


app.post('/movies/delete/:id', function(req, res){
  const movieId = req.params.id;
  Movie.findByIdAndRemove(movieId)
  .then(movie => {
    console.log(movie);
  })
  .catch(error => {
    console.log(error);
  })
res.redirect('/movies')
});

app.get('/movies/director/:director', function (req, res) {
    const theDirector = req.params.director
    Movie.find({director: theDirector}, function(err, movie) {
    res.render('moviesbydirector', {movie});
 });

});

app.get('/movies/:theIdthing', function (req, res) {
  const theId = req.params.theIdthing
  Movie.findById(theId)
  .then(theMovie => {
    console.log(theMovie);
    res.render('movieshow', {theMovie});
  })
});



app.get('/movies/year/:year', function (req, res) {
  const theYear = req.params.year
  Movie.find({year: theYear}, function(err, movie) {
  res.render('moviebyyear', {movie});
});
});








app.listen(3000, () => console.log('Example app listening on port 3000!'))

// 1. Connect to you mongoose database of movies that 
// we used earlier this week (it's called video)

// 2. Make an index page with all the movies 
// that shows their title, director, year, rating.

// 3 Make a route that looks like this ('/movies/:director')
// that will display a list of all the movies 
// that were directed by whichever director is typed into the url 

// 4. make a route that looks like this ('/movies/:year')
// that displays a list of all movies that were made in the year that is typed into the url
