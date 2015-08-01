'use strict';

var assert = require('assert'),
    should = require('should'),
    moodService = require('../../../services/auth.service')();

describe('MoodService', function() {
    var db;

    before(function(done) {
        db = mongoose.connect(config.db.uri, config.db.options, function(err) {
            if (err) {
                console.error(chalk.red('Could not connect to MongoDB!'));
                console.log(chalk.red(err));
            }
        });

        done();
    });

    after(function() {
        if (db) {
            db.disconnect();
        }
    });


});