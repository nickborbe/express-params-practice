// 2. Add a route that shows a form that the user can use to create a new movie 

// 3.  Make a post route so submit the information, and make a all to the database to create a new movie
// (don't forget to redirect back to the index page)

// 4.  Make a button to delete a movie.  This button should be on the index page, each movie in the list should have a button next to them 

// 5.  Add a route where users can visit to edit a movie.  The user should be able to click a link from the index page to access this page (each movie int he list should have this link)

// 6.  Add a route to handle the form submission when the user edits the movie.

// BONUS - make it so that when the user creates or edits a movie, we redirect straight to the page specifically for that movie

//===================================================================
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const bodyParser = require('body-parser');
//===========================================
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });
const Schema  = mongoose.Schema;
//==============================================

const movieSchema = new Schema({
  title: String,
  year: String,
  director: String,
  rate: String 
});

const Movie = mongoose.model('Movie', movieSchema);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
//================================================

app.get('/', function (req, res) {
  Movie.find()
  .then(movies => {
    let data = {};
    data.theList = movies;
    res.render('index', data)
  })
  .catch(theError => { console.log(theError)})
})


app.get('/movies/display/:id', function (req, res) {
  Movie.findById(req.params.id)
  .then(oneMovie =>{
    res.render('onemovie', {movie: oneMovie})
  })
})

app.get('/movies/new', function(req, res){
    res.render('createmovie');
})
app.post('/movies/create', function (req, res) {
  console.log("req body", req.body);
  const theActualTitle = req.body.theTitle;
  const theActualDirector = req.body.theDirector;
  const theActualYear = req.body.theYear;
  const theActualRate = req.body.theRate;
  
  const newMovie = new Movie({
    title : theActualTitle ,
    director: theActualDirector,
    year  : theActualYear,
    rate: theActualRate
  })
   
  newMovie.save()
  .then(newmovie => {
  console.log(newmovie);
  })
  .catch(theError => { console.log(theError) })

  res.redirect('/')
})



app.get('/movies/:director', function (req, res) {
  // console.log(req);
  const theDirector = req.params.director
  Movie.find({director: theDirector})
  .then(movies => {
    let data = {};
    data.directorList = movies;
    data.directorName = theDirector;

    res.render('moviesbydirector', data)
  })

  .catch(theError => {
    console.log(theError);
  })

})

app.get('/movies/:year', function (req, res) {
  // console.log(req);
  const theYear = req.params.year
  Movie.find({year: theYear})
  .then(movies => {
    let data = {};
    data.yearrList = movies;
    data.yearValue = theYear;

    res.render('moviesbyyear', data)
  })
  .catch(theError => {
    console.log(theError);
  })  
})



//another way to do it// still work in progress===================================
// app.get('/movies/display/:id', function (req, res) {
//   // const theId = req.params.title
//   // console.log(theId);
//   Movie.findById(req.params.id)
//   .then(oneMovies => {
//     console.log("+++++++++++++++++++++++++++++++++++++++++")
//     console.log("movie info  ", oneMovies);
//     res.render('onemovie', {oneMovies})
//     // {movie : oneMovies}
//   })
//   .catch(err => {
//     console.log(err);
//   })
// })
//========================================================






//==========================================

app.listen(3000, () => console.log('Example app listening on port 3000!'))
