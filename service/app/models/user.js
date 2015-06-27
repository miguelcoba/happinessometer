'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// TODO roles by user
module.exports = mongoose.model('User', new Schema({ 
    username: {
        type: String,
        required: true,
        unique : true
    },
    // TODO hashing the password
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique : true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
    },
    // TODO createdAt should be UTC
    createdAt: {
        type: Date,
        default: Date.now
    }
}));