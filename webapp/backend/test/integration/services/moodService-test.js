var assert = require('assert');
var should = require('should');

describe('MoodService', function() {
    var moodService = require('../../../app/services/moodService')();
    
    describe('#setMood', function() {
        it('without mood config should fail', function(done) {
            moodService.setMood(null, function(err) {
                should.exist(err);
                err.message.should.be.equal('No mood config provided.');
                done();
            });
        });
    });
});
