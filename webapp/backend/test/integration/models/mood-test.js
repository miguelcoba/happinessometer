var assert = require('assert');
var should = require('should');

var Mood = require('../../../app/models/mood');

describe('Mood', function() {
    var db;

    before(function() {
        //db = require('../../db');
        //db.connect();
    });

    after(function() {
        //db.disconnect();
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
            done();
        });
    });
});