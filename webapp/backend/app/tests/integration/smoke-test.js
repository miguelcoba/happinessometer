var assert = require('assert');
var app = require('../../app');
var http = require('http');

describe('Smoke', function() {
    var port = 3001,
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

    it('test', function() {
        var test = true;
        test.should.be.true;
    });
});