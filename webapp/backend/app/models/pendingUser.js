var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * A Pending users represents a request to add a new user to the application.
 *
 * When a new request to add a user is created a 'code' is associated to the request
 * and this code is used by the validation link to activate the new user.
 *
 * A request to add a user into the app is valid until 'validUntil' date.
 */
module.exports = mongoose.model('PendingUser', new Schema({ 
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    email: { type: String, lowercase: true, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    validUntil: { type: Date, required: true},
    code: { type: String, required: true }
}));