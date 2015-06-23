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

    it('GET /auth/example should create example user', function(done) {
        superagent.get(contextUrl + '/api/auth/example').end(function(err, res) {
            should.not.exist(err);
            var result = JSON.parse(res.text);
            result.success.should.be.true;
            result.message.should.equal("Example user created!");
            done();
        });
    });
});