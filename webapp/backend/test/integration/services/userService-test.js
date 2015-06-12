var assert = require('assert');
var should = require('should');

var userService = require('../../../app/services/userService')();

describe('UserService', function() {
    describe('#requestNewUser', function() {
        it('without new user configuration should fail', function(done) {
            userService.requestNewUser(null, function(err, newUser) {
                should.exist(err);
                err.message.should.be.equal('New user configuration not provided.');
                done();
            });
        });

        it('without email should fail', function(done) {
            var newUserBasicConfig = {
                firstName: 'Rafael',
                lastName: 'Gutierrez'
            };
            userService.requestNewUser(newUserBasicConfig, function(err, newUser) {
                should.exist(err);
                err.message.should.be.equal('New user email is required.');
                done();
            });
        });

        it('for an unexisting domain should fail', function(done) {
            var newUserBasicConfig = {
                email: 'rgutierrez@nearsoft.com',
                firstName: 'Rafael',
                lastName: 'Gutierrez'
            };
            userService.requestNewUser(newUserBasicConfig, function(err, newUser) {
                should.exist(err);
                done();
            });
        });
    });
});