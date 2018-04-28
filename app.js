

// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/video');
const Schema   = mongoose.Schema;


const movieSchema = new Schema({
  title :  String ,
  director: String,
  year  :  String,
  rate: String,
 duration: String,
 genre: [String]
});

const Movie = mongoose.model('Movie', movieSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


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
  res.render('newMovie')
})


app.get('/movies/:theidthing', function (req, res) {
  const theId = req.params.theidthing
  Movie.findById(theId)
  .then(movie => {
    let data = {};
    data.theMovie = movie;
    res.render('movieshow', data)
  })
  .catch(theError => { console.log(theError) })
})



app.get('/movies/director/:director', function (req, res) {
  const theDirector = req.params.director
  Movie.find({director: theDirector})
  .then(movies => {
    let data = {};
    data.directorList = movies;
    data.directorName = theDirector;
    res.render('moviesbydirector', data)
  })
  .catch(theError => { console.log(theError) })
})

app.get('/movies/year/:year', function (req, res) {
  const theYear = req.params.year
  Movie.find({year: theYear})
  .then(movies => {
    let data = {};
    data.yearList = movies;
    data.yearValue = theYear;
    res.render('moviesbyyear', data)
  })
  .catch(theError => { console.log(theError) })
})



app.post('/movies/create', function (req, res) {
  console.log("req body", req.body);

const theActualTitle = req.body.thetitle;
const theActualDirector = req.body.theDirector;
const theActualYear = req.body.theYear;


const newMovie = new Movie({
  title : theActualTitle ,
  director: theActualDirector,
  year  : theActualYear,
})

newMovie.save()
.then(movie => {
  // console.log(car);
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
    });
    res.redirect('/movies')
})












app.listen(3000, () => console.log('Example app listening on port 3000!'))
