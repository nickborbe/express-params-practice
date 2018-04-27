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
  year     : Number,
  director : String,
  duration : String,
  genre    : [String],
  rate     : Number
});

const Movie = mongoose.model('Movie', movieSchema);


// Routes
app.get('/', (req, res) => {
  Movie.find({}, function(err, movie) {
    console.log(' Movie: ', movie.title, movie.director, movie.year, movie.rating);
    res.render('index', {movie})
  });
});

app.get('/movies/:director', function (req, res) {
  let theDirector = req.params.director;
  let data = {theDirectorsName: theDirector }
  Movie.find({director: theDirector}, function(err, movie) {
    res.render('moviepage', {movie})
  });
})

app.get('/movies/:year', function (req, res) {
  let theYear = req.params.year;
  let data = {theMovieYear: theYear }
  Movie.find({year: theYear}, function(err, movie) {
    res.render('moviepage', {movie})
  });
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))
