'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Mood',  new Schema({
    mood: {
        type: String,
        enum: ['love', 'joy', 'normal', 'sadness', 'fear', 'disgust', 'anger', 'surprise'],
        required: true
    },
    comment: {
        type: String,
        maxlength: 140,
        required: true
    },
    // TODO createdAt should be UTC
    createdAt: {
        type: Date,
        default: moment().utc()
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.id;
            return ret;
        }
    }
}));