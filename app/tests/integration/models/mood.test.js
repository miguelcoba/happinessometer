'use strict';

var assert = require('assert'),
    async = require('async'),
    should = require('should'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    moment = require('moment'),
    config = require('../../../../config/config'),
    Company = require('../../../models/company'),
    Mood = require('../../../models/mood');

describe('Mood', function() {
    var db,
        company;

    before(function(done) {
        db = mongoose.connect(config.db.uri, config.db.options, function(err) {
            var newCompany;

            if (err) {
                console.error(chalk.red('Could not connect to MongoDB!'));
                console.log(chalk.red(err));
                done(err);
            } else {
                newCompany = new Company({
                    name: 'Company Inc',
                    domain: '@company.com'
                });
                newCompany.save(function(err, comp) {
                    if (err || !comp) {
                        done(err);
                    }
                    company = comp;
                    done();
                });
            }
        });
    });

    after(function(done) {
        if (db) {
            async.parallel([
                function(cb) {
                    Mood.remove({}, cb);
                },
                function(cb) {
                    Company.remove({}, cb);
                }
            ], function() {
                db.disconnect();
                done();
            });
        } else {
            done();
        }
    });

    it('#save() with Company should create a new Mood', function(done) {
        var mood = new Mood({
            mood: 'joy',
            comment: 'I dont have anything to add',
            company: company._id
        });

        mood.save(function(err, newMood) {
            should.not.exist(err);
            newMood.mood.should.be.equal(mood.mood);
            newMood.comment.should.be.equal(mood.comment);
            should.exist(newMood.createdAt);
            done();
        });
    });

    it('#save() with unexisting User should not create a new Mood', function(done) {
        var mood = new Mood({
            mood: 'joy',
            comment: 'I dont have anything to add',
            company: company._id,
            user: mongoose.Types.ObjectId()
        });

        mood.save(function(err, newMood) {
            should.exist(err);
            console.error(err);
            done();
        });
    });
});