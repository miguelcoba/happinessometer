'use strict';

var assert = require('assert'),
    should = require('should'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    moment = require('moment'),
    config = require('../../../config/config'),
    Mood = require('../../models/mood');

describe('Mood', function() {
    var db;

    before(function() {
        db = mongoose.connect(config.db.uri, config.db.options, function(err) {
            if (err) {
                console.error(chalk.red('Could not connect to MongoDB!'));
                console.log(chalk.red(err));
            }
        });
    });

    after(function() {
        if (db) {
            db.disconnect();
        }
    });

    it('#save() should create a new Mood', function(done) {
        var mood = new Mood({
            mood: 1,
            comment: 'I dont have anything to add'
        });

        mood.save(function(err, newMood) {
            should.not.exist(err);
            newMood.mood.should.be.equal(mood.mood);
            newMood.comment.should.be.equal(mood.comment);
            should.exist(newMood.createdAt);
            console.log(chalk.green(newMood.createdAt));
            console.log(chalk.blue(moment().utc()));
            done();
        });
    });
});