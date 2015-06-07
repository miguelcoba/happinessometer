var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MoodSchema = new Schema({
    mood: Number,
    description: String,
    createdAt: Date
});

module.exports = mongoose.model('Mood', MoodSchema);