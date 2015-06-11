var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO createdAt should be UTC
module.exports = mongoose.model('Mood',  new Schema({
    mood: { type: Number, min: 1, max: 3, required: true },
    comment: { type: String, maxlength: 140, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
}));