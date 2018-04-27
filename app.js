const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/video').then(() => {
	console.log('Connected to Mongo!')
  }).catch(err => {
	console.error('Error connecting to mongo', err)
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true}));

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

app.get('/', function(req, res) {
	res.redirect('/movies');
})

app.get('/create', function(req, res) {
	res.render('create');
	
})

app.post('/createMovie', function(req, res) {
	let newMovie = {
		title:  req.body.title,
		year: req.body.year,
		director: req.body.director,
		duration: req.body.duration,
		rate: req.body.rate
	}
	Movie.create(newMovie)
		.then(movie => {
			res.redirect('/');
	})
	.catch(error => {
		console.log(error)
	})
})

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

app.get('/movies/:_id', function (req, res) {
	// const theId = req.params.theidthing;
	console.log(req.params);
	Movie.findById(req.params)
	.then(movie => { 
		let data = {};
		data.theList = movie;
		res.render('movieshow', {movie});
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