const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const movies = require('./movies.json');
mongoose.connect('mongodb://localhost/movies');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: String,
  year: String,
  director: String,
  duration: String,
  genre: [],
  rate: String,
});

const Movie = mongoose.model('Movie', movieSchema);

app.set('views', path.join(__dirname, '/views')); //?????????????????????
app.set('view engine', 'hbs'); //??????????????????????????????

// app.use(express.static(path.join(__dirname, 'public'))); //????
// hbs.registerPartials(__dirname + '/views/partials'); //????????

app.use(bodyParser.urlencoded({ extended: true }));

// ========= routes ==================
app.get('/', function(req, res) {
  Movie.find()
    .then(movie => {
      let data = {};
      data.list = movie;
      res.render('index', data);
    })
    .catch(theError => {
      console.log(theError);
    });
});

app.get('/details/:_id', function(req, res) {
  Movie.findById(req.params).then(movie => {
    let data = { list: movie };
    res.render('details', data);
  });
});

app.get('/movies/director/:director', function(req, res) {
  console.log(req.params);
  Movie.find(req.params).then(movie => {
    console.log(movie.length);
    // let data = {
    //   theActualDirector: movie,
    // };
    res.render('directors', { movie });
    // let filterDirector = movies.filter(data.theActualDirector);
  });
});

app.get('/movies/year/:year', function(req, res) {
  console.log(req.params);
  Movie.find(req.params).then(movie => {
    console.log(movie.length);

    res.render('years', { movie });
  });
});

app.get('/movies/new', function(req, res) {
  res.render('newMovies');
});

app.post('/movies/create', function(req, res) {
  console.log('req body', req.body);

  const theActualTitle = req.body.theTitle;
  const theActualYear = req.body.theYear;
  const theActualDirector = req.body.theDirector;
  const theActualDuration = req.body.theDuration;
  const theActualRate = req.body.theRate;

  const newMovie = new Movie({
    title: theActualTitle,
    year: theActualYear,
    director: theActualDirector,
    duration: theActualDuration,
    rate: theActualRate,
  });

  newMovie
    .save()
    .then(Movie => {})
    .catch(theError => {
      console.log(theError);
    });

  res.redirect('/');
});

// const movieId = req.params.id;
// console.log(movieId);

app.post('/movies/delete/:id', function(req, res) {
  // const movieId = req.params.id;
  // console.log(movieId);
  Movie.findByIdAndRemove(req.params.id)
    .then(movie => {
      // console.log(movie);
    })
    .catch(error => {
      console.log(error);
    });
  res.redirect('/');
});

app.get('/movies/edit/:id', function(req, res) {
  Movie.findById(req.params.id).then(theMovie => {
    res.render('editMovie', { movie: theMovie });
  });
});

app.post('/movies/update/:id', function(req, res) {
  const theId = req.params.id;
  Movie.findByIdAndUpdate(theId, {
    title: req.body.title,
    year: req.body.year,
    director: req.body.director,
    duration: req.body.duration,
    rate: req.body.rate,
  })
    .then(movie => {})
    .catch(theError => {
      console.log(theError);
    });
  res.redirect('/details/' + theId);
});

app.listen(3000, () => console.log('Connected to server!'));
