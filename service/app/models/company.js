'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Company', new Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        lowercase: true,
        required: true,
        unique : true
    },
    // TODO createdAt should be UTC
    createdAt: {
        type: Date,
        default: moment().utc()
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            return ret;
        }
    }
}));