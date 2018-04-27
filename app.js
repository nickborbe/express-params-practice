// app.js
const express   = require('express')
const app       = express()
const hbs       = require('hbs')
const path      = require('path');
const mongoose  = require('mongoose');


// 1. Connect to you mongoose database of movies that we used earlier this week (it's called video)
mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo!', err)
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// create schema
const Schema = mongoose.Schema;
const movieSchema = new Schema({
  title: String,
  year: String,
  director: String,
  duration: String,
  genre: {type: Array}, //or is this []
  rate: String,
});

const Movie = mongooose.model('Movie',movieSchema);


// routes

app.get('/', function (req, res) {
  console.log(req)
})

app.get('/search', function (req, res) {
    res.send(req.query)
})

app.get('/users/:username', function (req, res) {
  let theUserName = req.params.username;
  // let theUser = User.find({username: theUserName})   this is how we will query the database
  let data = {theActualUserName: theUserName }
  res.render('userpage', data)
})

Movie.find({}.function(err,movie) {
  res.render('index',{movie}); 
  })

// 2. Make an index page with all the movies that shows their title, director, year, rating.

app.get('/', function (req, res) {
  Movie.find()
  .then(movies => {
    console.log(movies.title, movies.director);
    res.render('index', {movies});
  })
  .catch(error => {
    console.log(error)
  })
})


// 3 Make a route that looks like this ('/movies/:director')
// that will display a list of all the movies that were directed by whichever director is typed into the url 

// COMMENT TOGGLE ==>
app.get('/movies/:director', function (req, res) {
  Movie.find(req.params)
  .then(movies => {
    console.log(movies);
    res.render('movies', {movies});
  })
  .catch(error => {
    console.log(error)
  })
})
// <== COMMENT TOGGLE

// tried to do this a different way:
// app.get('/movies/:director', function (req, res) { 
//   res.send(req.params);
//   theDirector = req.params.value;
//   console.log(theDirector);
//   Movie.find({director:req.params.director},function(err,movie){
//     res.render('index',{movie});
//   });

// 4. make a route that looks like this ('/movies/:year') that displays a list of all movies that were made in the year that is typed into the url

// COMMENT TOGGLE ==>
// app.get('/movies/:year', function (req, res) {
//   Movie.find(req.params)
//   .then(movies => {
//     console.log(movies);
//     res.render('movies', {movies});
//   })
//   .catch(error => {
//     console.log(error)
//   })
// })
// <== COMMENT TOGGLE

// tried to do this a different way:
// app.get('/movies/:year', function (req, res) { 
//   res.send(req.params);
//   console.log(req.params.year);
//   Movie.find({year:req.params.year},function(err,movie){
//     res.render('index',{movie});
//   });

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))











