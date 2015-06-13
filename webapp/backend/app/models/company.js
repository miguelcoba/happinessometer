var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Company', new Schema({
    name: { type: String, required: true},
    domain: { type: String, lowercase: true, required: true, unique : true },
    createdAt: {
        type: Date,
        default: Date.now
    }
}));