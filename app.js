const mongoose = require('mongoose');
// const movieData = require('./movies.json');

// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');

mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const Schema = mongoose.Schema;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


const movieSchema = new Schema({
  title    : String,
  year     : String,
  director : String,
  duration : String,
  genre    : [String],
  rate     : String
});

const Movie = mongoose.model('Movie', movieSchema);


// Routes
app.get('/movies', (req, res) => {
  Movie.find({}, function(err, movie) {
    res.render('index', {movie})
  });
});

app.get('/movies/:id', (req, res) => {
  const theId = req.params.id;
  Movie.findById(theId, function(err, movie) {
    res.render('movieshow', {movie})
  });
});

app.get('/movies/director/:director', function (req, res) {
  let theDirector = req.params.director;
  Movie.find( {director: theDirector}, function(err, movie) {
    res.render('directorpage', {movie})
  });
})

app.get('/movies/year/:year', function (req, res) {
  let theYear = req.params.year;  
  Movie.find( {year: theYear}, function(err, movie) {
    console.log("blah: ", movie)
    res.render('yearpage', {movie})
  });
})


app.listen(3000, () => console.log('Practice app listening on port 3000!'))
