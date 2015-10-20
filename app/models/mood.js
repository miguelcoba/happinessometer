'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    moodEnum = require('./mood_enum'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Mood',  new Schema({
    company: {
        type: Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
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