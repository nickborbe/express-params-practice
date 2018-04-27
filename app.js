// app.js
const express  = require('express');
const app      = express();
const hbs      = require('hbs');
const path     = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
mongoose.connect('mongodb://localhost/video')
.then(() => {
  console.log('Connected to Mongo!')
}).catch(err => {
  console.error('Error connecting to mongo', err)
});
const Schema   = mongoose.Schema;

const movieSchema = new Schema({
  title: {type: String},
  director: {type: String},
  year: {type: String},
  duration: String,
  rate: {type: String},
  genre: [String]
});

const Movie = mongoose.model('Movie', movieSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyparser.urlencoded({extended: true}))
app.get('/movies', function (req, res) {
  Movie.find()
  .then(movies => {
    // console.log(movies[0].title); //Check if schema is set up properly
    let data = {}
    data.theList = movies;
    res.render('index', data) 
  })
  .catch(err => console.log(err));
});

app.get('/movies/new', function(req, res) {
  res.render('newMovie');
})

app.post('/movies/create', function (req, res) {
  console.log("req body: ", req.body);
  
  const newMovie = new Movie({
    title: req.body.theTitle,
    director: req.body.theDirector,
    year: req.body.theYear,
    duration: req.body.theDuration,
    rate: req.body.theRate,
    genre: req.body.theGenre
  })

  newMovie.save()
  .then(Movie => {
    console.log(Movie);
  })
  .catch(err => {console.log(err);
  })
  res.redirect('/movies')
})

app.get('/movies/edit/:id', function(req, res) {
  Movie.findById(req.params.id)
  .then(theMovie => {
    res.render('editMovie', {movie: theMovie});
  })
})

app.post('/movies/update/:id', function(req, res) {
  const moviePathId = req.params.id;

  Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    duration: req.body.duration,
    rate: req.body.rate,
    // genre: req.body.genre
  })
  .then(movie => {
    // console.log(req.body);
  })
  .catch(err => {console.log(err) })
  res.redirect('/movies/' + moviePathId)
  console.log(moviePathId);
})

app.get('/movies/:id', function (req, res) {
  const theId = req.params.id;
  Movie.findById(theId)
  .then(movies => {
    let data = {}
    data.theMovie = movies;
    res.render('movieshow', data) 
  })
  .catch(err => console.log(err));
});

app.post('/movies/delete/:id', function (req, res){
  const movieId = req.params.id;  
  Movie.findByIdAndRemove(movieId)
  .then(Movie => {
    console.log(Movie);
  })
  .catch(err => {
    console.log(err);
  })
  res.redirect("/movies")
})


app.get('/movies/director/:director', function (req, res) {
  const theDirector = req.params.director;
  Movie.find({director: theDirector})
  .then(movies => {
    let data = {}
    data.directorList = movies;
    data.directorName = theDirector;
    res.render('moviesbydirector', data) 
  })
  .catch(err => console.log(err));
});

app.get('/movies/year/:year', function (req, res) {
  const theYear = req.params.year;
  Movie.find({year: theYear})
  .then(movies => {
    let data = {}
    data.yearList = movies;
    data.yearValue = theYear;
    res.render('moviesbyyear', data) 
  })
  .catch(err => console.log(err));
});



app.listen(3000, () => console.log('Port 3000!'))