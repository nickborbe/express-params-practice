// app.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));


const videoSchema = new Schema({
  title: { type: String },
  director: { type: String},
  year: { type: String },
  duration: {type: String},
  rate: { type: String}

  
});

// const Movie = mongoose.model('Movie', videoSchema);

app.get('/movies', function (req, res) {
  console.log(req)


Movie.find()
.then(movies => {
  let data = {};
    data.theList = movies 
    res.render('index', data);
  })
.catch(therror =>{console.log(theError)})


})

app.get('/movies/new', function (req, res) {
  res.render('newMovie')
})
// Movie details page

app.get('/movies/:id', function (req, res) {
  Movie.findById(req.params.id).then(theMovie =>{
  res.render('movieDetails', {movie: theMovie})
})
  
})
// end of movie details page.

// 2. Add a route that shows a form that the user can use to create a new movie 

app.post('/movies/create', function (req, res) {
console.log("req body", req.body);

const theActualTitle = req.body.theTitle;
const theActualDirector = req.body.theDirector;
const theActualYear = req.body.theYear;
const theActualDuration = req.body.theDuration;
const theActualRate= req.body.theRate;
// title director year duration rate

const newMovie = new Movie({
title : theActualTitle,
director: theActualDirector,
year  : theActualYear,
duration: theActualDuration,
rate: theActualRate
})

newMovie.save()
.then(movie => {

})
.catch(theError => { console.log(theError) })

res.redirect('/movies')
})


// ***************** End of create page route **********************

// *************************Delete a movie button******************
app.post('/movies/delete/:id', function(req, res){
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


// ************************End of Delete a movie button*************

// ***********************Edit a movie button route ****************

app.get('/movies/edit/:id', function (req, res) {
  Movie.findById(req.params.id)
  .then(theMovie =>{
    res.render('editMovie', {movie: theMovie})
  })
})

app.post('/movies/update/:id', function (req, res) {
Movie.findByIdAndUpdate(req.params.id, {
  title: req.body.title,
  director: req.body.director,
  year: req.body.year,
  duration: req.body.duration,
  rate: req.body.rate
})
.then(movie => {
 
})
.catch(theError => { console.log(theError) })

res.redirect('/movies')
})




// **********************end of Edit button ***********************
const Movie = mongoose.model('Movie', videoSchema);

app.get('/movies/director/:director', function (req, res) {
 const theDirector = req.params.director
Movie.find({director: theDirector})
.then(movies => {
  let data = {};
    data.directorList = movies ;
    data.directorList = theDirector;
    res.render('moviesDirector', data);
  })
.catch(therror =>{console.log(theError)})


})

app.get('/movies/year/:year', function (req, res) {
 
  Movie.find({director: theDirector})
  .then(movies => {
    let data = {};
      data.directorList = movies ;
      data.directorList = theDirector;
      res.render('moviesDirector', data);
    })
  .catch(therror =>{console.log(theError)})
  
  
  })





// title, director, year, rating

app.get('/users/:username', function (req, res) {
  let theUserName = req.params.username;
  // let theUser = User.find({username: theUserName})   this is how we will query the database
  let data = {theActualUserName: theUserName }
  res.render('userpage', data)
})


app.get('/search', function (req, res) {
  res.send(req.query)
})






app.listen(3000, () => console.log('Example app listening on port 3000!'))
