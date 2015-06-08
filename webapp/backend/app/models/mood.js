var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Mood',  new Schema({
    mood: Number,
    description: String,
    createdAt: Date
}));