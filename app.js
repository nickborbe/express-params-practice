// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/video');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');


const movieSchema = new Schema ({
  title :String,
  director : String,
  year : {type: String},
  rate: String,
  duration: {type: String},
  genre: [String]
});

const Movie = mongoose.model('Movie', movieSchema)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/movies', function (req, res) {
  // Movie.find()
  Movie.find()
    .then(movie => { 
      // console.log(movies[0].title);
      let data = {};
      data.theList = movie;
      res.render('index', data)
  })
  .catch(theError => {console.log(theError)})
})

app.get('/movies/director/:director', function (req, res) {
  const theDirector = req.params.director
  Movie.find({director: theDirector})
    .then(movie => { 
      // console.log(movies[0].title);
      let data = {};
      data.directorList = movie;
      data.directorName = theDirector;
      res.render('moviesbydirector', data)
  })
  .catch(theError => {console.log(theError)})
})

app.get('/movies/year/:year', function (req, res) {
  const theYear = req.params.year

  Movie.find({year: theYear})
    .then(movie => { 
      let data = {};
      data.yearList = movie;
      data.yearName = theYear;
      res.render('moviesbyyear', data)
  })
  .catch(theError => {console.log(theError)})
})

app.get('/movies/movieID/:theidthing', function (req, res) {
  const theId = req.params.theidthing
  Movie.findById(theId)   
    .then(movie => { 
      let data = {};
      data.theMovie= movie;
      res.render('movieshow', data)
  })
  .catch(theError => {console.log(theError)})
})
//
//
app.get('/movies/new', function (req, res) {
  res.render('newMovie')
})

app.post('/movies/create', function (req, res) {
  // console.log("req body", req.body);

  const theActualTitle = req.body.theTitle;
  const theActualYear = req.body.theYear
  const theActualDirector = req.body.theDirector
  const theActualDuration = req.body.theDuration
  const theActualGenre = req.body.theGenre
  const theActualRate = req.body.theRate


  const newMovie = new Movie({
    title :theActualTitle,
    director :theActualDirector,
    year : theActualYear,
    rate: theActualRate,
    duration: theActualDuration,
    genre: theActualGenre
  })

  newMovie.save()
  .then(movie => {
    //console.log(movie);
  })
  .catch(theError => { 
    console.log(theError)
  })

  res.redirect('/movies')
})

app.post('/movies/delete/:id', function (req, res) {
  const movieId = req.params.id;
  Movie.findByIdAndRemove(movieId)
  .then(movie => {
    console.log(movie);
  })
  .catch(error => {
    console.log(error);
  })
res.redirect('/movies')
})

app.get('/movies/edit/:id', function (req, res) {
  Movie.findById(req.params.id)
  .then(theMovie => {
    res.render('editMovie', {movie: theMovie})
  })
})


app.post('/movies/update/:id', function (req, res) {
Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,// 
    year: req.body.year,//
    director: req.body.director,//
    duration: req.body.duration,//
    genre: req.body.genre,//
    rate: req.body.rate,//
  })


  .then(movie => {
    //console.log(car);
  })
  .catch(theError => { 
    console.log(theError)
  })

  res.redirect('/movies')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
