'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    randomstring = require('randomstring'),
    config = require('../../config/config'),    
    Schema = mongoose.Schema,
    pendingUserSchema;

/**
 * A Pending users represents a request to add a new user to the application.
 *
 * When a new request to add a user is created a 'code' is associated to the request
 * and this code is used by the validation link to activate the new user.
 *
 * A request to add a user into the app is valid until 'validUntil' date.
 */
pendingUserSchema = new Schema({ 
    email: {
        type: String,
        lowercase: true, 
        required: true,
        unique: true
    },
    validUntil: {
        type: Date,
        required: true,
        default: moment().add(config.app.pendingUser.validUntilDays, 'days').utc() 
    },
    code: {
        type: String,
        unique: true,
        required: true,
        default: randomstring.generate(35)
    },
    createdAt: {
        type: Date,
        default: moment().utc()
    },
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);