var assert = require('assert');
var should = require('should');

var userService = require('../../../app/services/userService')();
var companyService = require('../../../app/services/companyService')();

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
                err.message.should.be.equal('There is no domain registered for @nearsoft.com.')
                done();
            });
        });

        describe('with a domain @nearsoft.com', function() {
            beforeEach(function(done) {
                companyService.createNewCompany({
                        name: 'Nearsoft',
                        domain: '@nearsoft.com'
                    }, function() {
                        done();
                    });
            });

            afterEach(function(done) {
                companyService.deleteWithDomain('@nearsoft.com', function() {
                    done();
                });
            });

            it('with a valid user config should create a new pending user', function(done) {
                var newUserBasicConfig = {
                    email: 'rgutierrez@nearsoft.com',
                    firstName: 'Rafael',
                    lastName: 'Gutierrez'
                };
                userService.requestNewUser(newUserBasicConfig, function(err, pendingUser) {
                    should.not.exist(err);
                    pendingUser.name.first.should.be.equal(newUserBasicConfig.firstName);
                    pendingUser.name.last.should.be.equal(newUserBasicConfig.lastName);
                    pendingUser.email.should.be.equal(newUserBasicConfig.email);
                    pendingUser.code.should.be.valid;
                    done();
                });
            });
        });
    });
});