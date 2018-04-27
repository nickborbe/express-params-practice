const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser')

const movieSchema = new Schema({
  title: {type: String, required: true},
  director: {type: String, required: true},
  year: {type: String, required: true},
  rate: {type: String, required: true},
  duration: {type: String, required: true},
  genre:[String]
});

const Movie = mongoose.model('Movie', movieSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo Database - video')
  }).catch(err => {
    console.error('Error connecting to  Mongo Database - video', err)
  });

app.get('/', function (req, res) {
  Movie.find()
  .then(movies => {
    let data = {};
    data.theList = movies;
    res.render('index', data);
  })
  .catch(theError => {
    console.log(theError);
  })
});

app.get('/movies', function (req, res) {
  Movie.find()
  .then(movies => {
    let data = {};
    data.theList = movies;
    res.render('index', data)
  })
  .catch(theError => {
    console.log(theError) })
})

// get rout to make form displayed
app.get('/movies/new', function (req, res) {
    res.render('newMovie')
})

// post route to make form submitted
app.post('/movies/create', function (req, res) {
  console.log("req body", req.body);

const theActualTitle = req.body.theTitle;
const theActualDirector = req.body.theDirector;
const theActualYear = req.body.theYear;

const newMovie = new Movie({
  title: theActualTitle ,
  director: theActualDirector,
  year: theActualYear
})


console.log(newMovie);

newMovie.save()
.then(movie => {
  // console.log(car);
})
.catch(theError => { 
  console.log(theError) 
})
res.redirect('/movies')
})


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
  })
  .then(movie => {
    // console.log(car);
  })
  .catch(theError => { console.log(theError) })
  
  res.redirect('/movies')
  })




app.get('/movies/:id', function (req, res) {
  const theId = req.params.id;
  Movie.findById(theId)
  .then(oneMovieFromDB => {
    // .then() means that everything is OK and it will display the page
    // oneMovieFromDB is response from DB based on Movie.findById(theId)
    let data = {};
    data.theMovie = oneMovieFromDB;
    res.render('movieshow', data);
  })
  .catch(theError => {
    // .catch() means something is wrong and it will display ann error
    console.log(theError);
  })
});

app.get('/movies/director/:director', function (req, res) {
  const theDirector = req.params.director;
  Movie.find({director: theDirector})
  .then(movies => {
    let data = {};
    data.directorList = movies;
    data.directorName = theDirector;
    res.render('moviesbydirector', data);
  })
  .catch(theError => {
    console.log(theError);
  })
});

app.get('/movies/year/:year', function (req, res) {
  const theYear = req.params.year;
  Movie.find({year: theYear})
  .then(movies => {
    let data = {};
    data.yearList = movies;
    data.selectedYear = theYear;
    res.render('moviesbyyear', data);
  })
  .catch(theError => {
    console.log(theError);
  })
});

app.listen(3000, () => console.log('Server started - localhost:3000'))

//Closes the connection to the video database.
// mongoose.connection.close();



