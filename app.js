// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const movieSchema = new Schema ({
  title: String,
  year: String,
  director: String,
  duration: String,
  genre: [],
  rate: String
})

const Movie  = mongoose.model('Movie', movieSchema);

// let callback = ((err, users) => {});

app.get('/', function (req, res) {
  Movie.find()
  .then(movies => {
    console.log(movies);
    res.render('index', {movies});
  })
  .catch(error => {
    console.log(error)
  })
})

// MUST COMMENT OUT /movies/:director FOR /movies/:year TO WORK

// app.get('/movies/:director', function (req, res) {
//   Movie.find(req.params)
//   .then(movies => {
//     console.log(movies);
//     res.render('movies', {movies});
//   })
//   .catch(error => {
//     console.log(error)
//   })
// })


app.get('/movies/:year', function (req, res) {
  Movie.find(req.params)
  .then(movies => {
    console.log(movies);
    res.render('movies', {movies});
  })
  .catch(error => {
    console.log(error)
  })
})






app.listen(3000, () => console.log('Example app listening on port 3000!'))
