var mongoose = require('mongoose');
var config = require('./config');

module.exports = {
    connect: function () {
        mongoose.connect(config.database); // connect to our database
    },
    disconnect: function() {
        mongoose.disconnect();
    }
};