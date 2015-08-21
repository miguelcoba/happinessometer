'use strict';

var assert = require('assert'),
    should = require('should'),
    superagent = require('superagent'),
    app = require('../../app'),
    http = require('http'),
    status = require('http-status');

describe("/v1", function() {
    var baseUrl = "http://localhost:3000/v1",
        port = 3000,
        server;
    before(function() {
        app.set('port', port);
        server = http.createServer(app);
        server.listen(port);
    });

    after(function() {
        if (server) {
            server.close();
        }
    });

    describe("/companies", function() {
        it('GET with existing domain', function(done) {
            superagent.get(baseUrl + '/companies/@nearsoft.com').end(function(err, res) {
                should.not.exist(err);
                assert.equal(res.status, status.OK);
                var result = JSON.parse(res.text);
                assert.equal(result.name, "Nearsoft");
                assert.equal(result.domain, "@nearsoft.com");
                done();
            });
        });

        it('GET without existing domain', function(done) {
            superagent.get(baseUrl + '/companies/@gmail.com').end(function(err, res) {
                should.exist(err);
                assert.equal(res.status, status.NOT_FOUND);
                var result = JSON.parse(res.text);
                assert.equal(result.message, "No Company with domain @gmail.com");
                done();
            });
        });
    });
});