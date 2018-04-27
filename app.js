const express = require('express')
const app     = express()
const hbs     = require('hbs')
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Movie = require('./views/schema/videoSchema.js')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to VideoDB!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

app.get('/movies', function (req, res) {
  Movie.find()
  .then(movies => {
    let data = {};
    data.theList = movies;
    res.render('index', data)
  })
  .catch(err => {console.log(err)});
})

app.get('/movies/select/:id', function (req, res) {
  const theId = req.params.id;
  Movie.findById(theId)
  .then(movie => {
    res.render('movieshow', movie);
  })
  .catch(err => {console.log(err)});
})

app.get('/movies/director/:director', function (req, res) {
  const theDirector = req.params.director;
  Movie.find({director: theDirector})
  .then(direc => {
    let data = {};
    data.directorList = direc;
    data.directorName = theDirector;
    res.render('director', data);
  })
  .catch(err => {console.log(err)});
})


app.get('/movies/year/:year', function (req, res) {
  const theYear = req.params.year;
  Movie.find({year: theYear})
  .then(years => {
    let data = {};
    data.yearList = years;
    data.yearValue = theYear;
    res.render('year', data);
  })

})

app.get('/movies/new', (req, res) => {
  res.render('newMovie');
})

app.post('/movies/create', (req, res) => {

  const newMovie = new Movie ({
    title: req.body.theNewTitle,
    year: req.body.theNewYear,
    duration: req.body.theNewDuration,
    director: req.body.theNewDirector,
    genre: [req.body.theNewGenre],
    rate: req.body.theNewRate
  })

  newMovie.save()
  .then( movie => {console.log(movie)})
  .catch( err => {res.send(err)})

  res.redirect('/movies');
})

app.post('/movies/delete/:id', (req, res) => {
  const movId = req.params.id;
  Movie.findByIdAndRemove(movId)
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
