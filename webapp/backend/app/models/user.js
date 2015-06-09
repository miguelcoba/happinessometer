var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO hashing the password
module.exports = mongoose.model('User', new Schema({ 
    username: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    name: {
        first: String,
        last: String
    },
    email: { type: String, lowercase: true, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
}));