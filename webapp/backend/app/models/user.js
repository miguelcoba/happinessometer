var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO hashing the password
// TODO roles by user
// TODO createdAt should be UTC
module.exports = mongoose.model('User', new Schema({ 
    username: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    name: {
        first: String,
        last: String
    },
    email: { type: String, lowercase: true, required: true },
    enabled: { type: Boolean, required: true, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: { type: String, required: true }
}));