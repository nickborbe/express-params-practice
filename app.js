const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/video').then(() => {
	console.log('Connected to Mongo!')
  }).catch(err => {
	console.error('Error connecting to mongo', err)
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const Schema   = mongoose.Schema;
const movieSchema = new Schema({
	title : String,
  	year  : String,
  	director: String,
  	duration: String,
  	genre: [],
  	rate : String
});

const Movie = mongoose.model('Movie', movieSchema);

app.get('/', function (req, res) {
	Movie.find({}, function(err, movie) {
		res.render('index', {movie});
	});
});

app.get('/movies/:director', function (req, res) {
  let theUserName = req.params.username;
  // let theUser = User.find({username: theUserName})   this is how we will query the database
  let data = {theActualUserName: theUserName }
  res.render('userpage', data)
})

app.get('/movies/:year', function (req, res) {
  let theUserName = req.params.username;
  // let theUser = User.find({username: theUserName})   this is how we will query the database
  let data = {theActualUserName: theUserName }
  res.render('userpage', data)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))