// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/video');
const Schema   = mongoose.Schema;


app.use(bodyParser.urlencoded({ extended: true }));

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


app.get('/movies/new', (req, res) => {
  res.render('newMovie');
})


app.post('/movies/create', function (req, res) {
  console.log("req body", req.body);

  const newMovie = new Movie ({
  title: req.body.theNewTitle,
  year: req.body.theNewYear,
  director: req.body.theNewDirector,
  })

  newMovie.save()
  .then( movie => {console.log(movie)})
  .catch( err => {res.send(err)})

  res.redirect('/movies');
})




app.post('/movies/delete/:id', (req, res) => {
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

app.get('/movies/edit/:id', (req, res) => {
  Movie.findById(req.params.id)
  .then(theMovie =>{
    res.render('editMovie', {movie: theMovie})
  })
})



app.post('/movies/update/:id', (req, res) => {
  Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    year: req.body.year,
    director: req.body.director,
    duration: req.body.duration,
    genre: req.body.genre,
    rate: req.body.rate
  })
  .then(movie => {
    console.log(movie);
    res.redirect(`/movies/select/${movie._id}`)
  })
  .catch(theError => { console.log(theError) })
  
  
  })
  









app.listen(3000, () => console.log('Example app listening on port 3000!'))
