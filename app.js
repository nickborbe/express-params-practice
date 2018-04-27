// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/video')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended:true}))

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


// app.get('/movies/:directorOrYear', function (req, res) {
//   //res.send(req.params);
//   //myDirector = req.params.value;
//  // console.log(myDirector);
//  console.log(Object.values(req.params)[0]);
//  if(Object.values(req.params)[0].includes(' ')){
   
//    myKey = {director:Object.values(req.params)[0]}
//  }
//  else{
//    myKey = {year:Object.values(req.params)[0]}
//  }
//   Movie.find(myKey, function(err, movie) {
//     res.render('index', {movie});
//  });

// })

app.get('/movies/year/:year', function (req, res) {
  //res.send(req.params);
  console.log(req.params.year);
  Movie.find({year: req.params.year}, function(err, movie) {
    res.render('byYear', {movie});
 });

})

app.get('/movies/director/:director', function (req, res) {
  //res.send(req.params);
  //myDirector = req.params.value;
 // console.log(myDirector);
  Movie.find({director: req.params.director}, function(err, movie) {
    res.render('byDirector', {movie});
 });

})

app.get('/movies/oneMovie/:id', function (req,res){
  Movie.findById(req.params.id)
  .then(theMovie =>{
        let data = {};
        data.theList = theMovie;
      res.render('oneMovie',data)
  })
});

app.get('/movies/new', function (req,res){
  res.render('newMovie')
})


app.post('/movies/create', function (req, res){
  const theActualTitle =  req.body.title;
  const theActualDirector = req.body.director;
  const theActualYear = req.body.year;
  const theActualRating = req.body.rate;
   
  const newMovie = new Movie({
       title: theActualTitle,
       director: theActualDirector,
       year: theActualYear,
       rate: theActualRating
   });

   newMovie.save()
   .then(movie => {
      console.log(movie)
   })
   .catch(theError => {console.log(theError)})

   res.redirect('/')
})

app.post('/movies/delete/:id', function (req, res){
  const movieId = req.params.id
  Movie.findByIdAndRemove(movieId)
  .then(movie =>{
      console.log(movie)
  })
  .catch(error => {
      console.log(error)
  })
  res.redirect('/')
})


app.get('/movies/edit/:id', function (req,res){
  Movie.findById(req.params.id)
  .then(theMovie =>{
    let data = {}
    data.theList = theMovie
      res.render('editMovie',data)
  })
 
})

app.post('/movies/update/:id', function (req, res){
  const id = req.params.id
  const theActualTitle =  req.body.title;
  const theActualDirector = req.body.director;
  const theActualYear = req.body.year;
  const theActualRating = req.body.rate;
   
  Movie.findByIdAndUpdate(id,{
      title: theActualTitle,
      director: theActualDirector,
      year: theActualYear,
      rate: theActualRating
  })
   .then(theMovie => {
      console.log(theMovie)
   })
   .catch(theError => {console.log(theError)})

   res.redirect('/movies/oneMovie/'+req.params.id)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
