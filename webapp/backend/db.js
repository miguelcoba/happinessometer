var mongoose = require('mongoose');
var config = require('./config');

module.exports = {
    connect: function () {
        // Note: the default size of the pool is 5
        var options = {
            db: { native_parser: true },
            server: {
                poolSize: 5,
                socketOptions: { keepAlive: 1 }
            }
        }
        mongoose.connect(config.database, options);
    },
    disconnect: function() {
        mongoose.disconnect();
    }
};