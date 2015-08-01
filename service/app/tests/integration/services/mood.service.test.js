'use strict';

var assert = require('assert'),
    should = require('should'),
    moodService = require('../../../services/mood.service')();

describe('MoodService', function() {
    
    describe('#setMood', function() {
        it('without mood config should fail', function(done) {
            moodService.setMood(null, function(err) {
                should.exist(err);
                err.message.should.be.equal('No mood values provided.');
                done();
            });
        });
    });
});
