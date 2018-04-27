const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema ({
    title: String,
    year: String, 
    director: String, 
    duration: String, 
    genre: [String],
    rate: String
})

module.exports = mongoose.model('Movie', videoSchema);
