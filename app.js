// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/video')
  .then(() => {
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

})


app.get('/movies/:directorOrYear', function (req, res) {
  //res.send(req.params);
  //myDirector = req.params.value;
 // console.log(myDirector);
 console.log(Object.values(req.params)[0]);
 if(Object.values(req.params)[0].includes(' ')){
   
   myKey = {director:Object.values(req.params)[0]}
 }
 else{
   myKey = {year:Object.values(req.params)[0]}
 }
  Movie.find(myKey, function(err, movie) {
    res.render('index', {movie});
 });

})

// app.get('/movies/:year', function (req, res) {
//   //res.send(req.params);
//   console.log(req.params.year);
//   Movie.find({year: req.params.year}, function(err, movie) {
//     res.render('index', {movie});
//  });

// })

// app.get('/movies/:director', function (req, res) {
//   //res.send(req.params);
//   //myDirector = req.params.value;
//  // console.log(myDirector);
//   Movie.find({director: req.params.director}, function(err, movie) {
//     res.render('index', {movie});
//  });

// })







app.listen(3000, () => console.log('Example app listening on port 3000!'))
