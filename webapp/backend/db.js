var mongoose = require('mongoose');
var config = require('./config');

function connect() {
    mongoose.connect(config.database); // connect to our database
}

module.exports = connect;