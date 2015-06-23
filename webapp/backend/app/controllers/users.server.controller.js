'use strict';

var userService = require('../services/user.service')();

exports.requestNewUserAccount = function(req, res) {
    userService.requestNewUser({
        email: req.body.email
    }, function(err, request) {
        res.json({}); // TODO
    });
}