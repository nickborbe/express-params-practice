// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const Schema   = mongoose.Schema;

const movieSchema = new mongoose.Schema({
  title : String,
  year  : String,
  director: String,
  duration: String,
  genre: [],
  rate : String
});

const Movie = mongoose.model('Movie', movieSchema);

app.get('/index', function (req, res) {
  Movie.find({}, function(err, movie) {
    res.render('index', {movie});
 });

});

app.post("/index", (req, res) => {
 
});


app.get('/users/:username', function (req, res) {
  let theUserName = req.params.username;
  let theUser = User.find({username: theUserName})  //  this is how we will query the database
  let data = {theActualUserName: theUserName }
  res.render('userpage', data)
})


app.get('/search', function (req, res) {
  res.send(req.query)
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))

// 1. Connect to you mongoose database of movies that 
// we used earlier this week (it's called video)

// 2. Make an index page with all the movies 
// that shows their title, director, year, rating.

// 3 Make a route that looks like this ('/movies/:director')
// that will display a list of all the movies 
// that were directed by whichever director is typed into the url 

// 4. make a route that looks like this ('/movies/:year')
// that displays a list of all movies that were made in the year that is typed into the url


