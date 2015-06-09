var assert = require('assert');
var should = require('should');

//var db = require('../../db')(); ??????
var User = require('../../app/models/user');

describe('User', function() {
    it('#username is required', function(done) {
        var user = new User({
        });

        user.save(function(err) {
            should.exist(err.errors.username);
            err.errors.username.kind.should.be.equal('required');
            done();
        });
    });

    it('#password is required', function(done) {
        var user = new User({
        });

        user.save(function(err) {
            should.exist(err.errors.password);
            err.errors.password.kind.should.be.equal('required');
            done();
        });
    });

    it('#email is required', function(done) {
        var user = new User({
        });

        user.save(function(err) {
            should.exist(err.errors.email);
            err.errors.email.kind.should.be.equal('required');
            done();
        });
    });

    it('#save() should create a new User', function(done) {
        var user = new User({
            username: 'rgutierrez',
            password: 'secret',
            email: 'rgutierrez@email.com',
            name: {
                first: 'Rafael', last: 'Gutierrez'
            }
        });

        user.save(function(err, newUser) {
            should.not.exist(err);
            newUser.username.should.be.equal(user.username);
            newUser.password.should.be.equal(user.password);
            newUser.email.should.be.equal(user.email);
            newUser.name.first.should.be.equal(user.name.first);
            newUser.name.last.should.be.equal(user.name.last);
            should.exist(newUser.id);
            should.exist(newUser.createdAt);
            done();
        });
    });
});