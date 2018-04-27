// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
app.use(bodyParser.urlencoded({ extended: true }));



// Routes

// Home
app.get('/movies', (req, res) => {
  Movie.find({}, function(err, movie) {
    res.render('index', {movie})
  });
});

// Movie Details Page
app.get('/movies/:id', (req, res) => {
  const theId = req.params.id;
  Movie.findById(theId, function(err, movie) {
    res.render('movieshow', {movie})
  });
});

// New Movie
app.get('/movie/new', (req, res) => {
  res.render('newmovie')
})

app.post('/movies/create', (req, res) => {
  const theActualTitle = req.body.theTitle;
  const theActualDirector = req.body.theDirector;
  const theActualYear = req.body.theYear;
  const theActualRating = req.body.theRating;
  const theActualDuration = req.body.theDuration;
  const theActualGenre = req.body.theGenre;

  const newMovie = new Movie ({
    title    : theActualTitle,
    year     : theActualYear,
    director : theActualDirector,
    duration : theActualDuration,
    genre    : theActualGenre,
    rate     : theActualRating
  })

  newMovie.save()
    .then(movie => {
    })
    .catch(theError => {console.log(theError) })

  res.redirect('/movies/'+newMovie._id)
})

// Delete Movie
app.post('/movies/delete/:id', (req, res) => {
  const movieId = req.params.id;
  const theMovie = Movie.findByIdAndRemove(movieId)
  .then(movie => {
  })
  .catch(error => {
    console.log(error);
  })
  res.redirect('/movies')
})

// Edit Movie Page
app.get('/movies/edit/:id', (req, res) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
  .then(theMovie => {
    res.render('editmovie', {movie: theMovie})
  })
  .catch(error => {
    console.log(error);
  })
})

// Actually update the movie and display updated details page
app.post('/movies/update/:id', (req, res) => {
  const id = req.params.id;

  Movie.findByIdAndUpdate(id, {
    title    : req.body.title,
    year     : req.body.year,
    director : req.body.director,
    duration : req.body.duration,
    genre    : req.body.genre,
    rate     : req.body.rating
  })
    .then(movie => {
      // console.log(car);
    })
    .catch(theError => {console.log(theError) })
  
  res.redirect('/movies/'+req.params.id)
})

// Display all movies with a certain director on a page
app.get('/movies/director/:director', function (req, res) {
  let theDirector = req.params.director;
  Movie.find( {director: theDirector}, function(err, movie) {
    res.render('directorpage', {movie})
  });
})

// Display all movies from a certain year on a page
app.get('/movies/year/:year', function (req, res) {
  let theYear = req.params.year;  
  Movie.find( {year: theYear}, function(err, movie) {
    console.log("blah: ", movie)
    res.render('yearpage', {movie})
  });
})


app.listen(3000, () => console.log('Practice app listening on port 3000!'))
