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

app.get('/movies', function (req, res) {
	Movie.find()
	.then(movies => { 
		let data = {};
		data.theList = movies;
		res.render('index', data);
	})
	.catch (theError => {
		console.log(theError); 
	});
});

app.get('/movies/:theidthing', function (req, res) {
	const theId = req.params.theidthing;
	Movie.findById(theId)
	.then(movie => { 
		let data = {};
		data.theList = movie;
		res.render('movieshow', data);
	})
	.catch (theError => {
		console.log(theError); 
	});
});

app.get('/movies/director/:director', function (req, res) {
	const theDirector = req.params.director;
	Movie.find({director: theDirector})
	.then(movies => {
		let data = {};
		  data.theList = movies;
		  data.directorName = theDirector;
	  	res.render('moviesbydirector', data);
	})
	.catch (theError => {
		console.log(theError); 
	});
});

app.get('/movies/year/:year', function (req, res) {
	const theDirector = req.params.year;
	Movie.find({year: theYear})
	.then(movies => {
		let data = {};
		data.yearList = movies;
		data.yearValue = theDirector;
	  	res.render('moviesbyyear', data);
	})
	.catch (theError => {
		console.log(theError); 
	});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))