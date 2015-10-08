'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    moodEnum = require('./mood_enum'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Mood',  new Schema({
    user: {
        type: String,
        required: false,
    },
    mood: {
        type: String,
        enum: moodEnum,
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
        default: Date.now
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