'use strict';

var _ = require('lodash'),
    assert = require('assert'),
    async = require('async'),
    should = require('should'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    chalk = require('chalk'),
    config = require('../../../../config/config'),
    Mood = require('../../../models/mood'),
    moodEnum = require('../../../models/mood_enum'),
    moodService = require('../../../services/mood.service')(),
    moodReportService = require('../../../services/moodReport.service')();

describe.only('MoodReportService', function() {
    var db;

    before(function (done) {
        db = mongoose.connect(config.db.uri, config.db.options, function (err) {
            if (err) {
                console.error(chalk.red('Could not connect to MongoDB!'));
                console.log(chalk.red(err));
            }
            done(err);
        });
    });

    after(function (done) {
        if (db) {
            async.parallel([
                function (cb) {
                    cb();
                    //Mood.remove({}, cb);
                }
            ], function () {
                db.disconnect();
                done();
            });
        } else {
            done();
        }
    });

    describe('getting overall mood', function() {
        before(function(done) {
//            var moods = [],
//                mood,
//                total = 35,
//                index = 1;
//            while (index <= total) {
//                mood = moodEnum[_.random(0, 7)];
//                moods.push({ mood: mood, comment: 'Im feeling ' + mood});
//                index++;
//            }
//
//            async.each(moods, function(mood, callback) {
//                moodService.setMood(mood, function(err, m) {
//                    if (err) return callback(err);
//                    callback();
//                });
//            }, function(err) {
                done();
//            });
        });

        it('should succeed', function(done) {
            moodReportService.overallMood(function(err, results) {
                console.log(JSON.stringify(results, null, 3));
                done();
            });
        });

        it('should print all', function(done) {
            moodService.findAll(function(err, results) {
                //console.log(JSON.stringify(results, null, 3));
                done();
            });
        });
    })
});