var assert = require('assert');
var http = require('http');
var superagent = require('superagent');
var should = require('should');

var app = require('../../../app');

describe('/api', function() {
    var port = 3001,
        contextUrl = 'http://localhost:' + port,
        server;

    before(function() {
        console.log('Starting app...');
        app.set('port', port);
        server = http.createServer(app);
        server.listen(port);
    });

    after(function() {
       console.log('Stopping app...');
       server.close();
    });

    beforeEach(function(){
        console.log('before every test')
    });

    it('POST /users should create a new user', function(done) {
        superagent.post(contextUrl + '/api/users')
            .send({
                username: 'rgutierrez',
                password: 'secret',
                email: 'rgutierrez@nearsoft.com',
                firstName: 'Rafael',
                lastName: 'Gutierrez'
            })
            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .end(function(err, res) {
                should.not.exist(err);
                var result = JSON.parse(res.text);
                result.success.should.be.true;
                result.message.should.be.equal('User created!');
                done();
        });
    });
});