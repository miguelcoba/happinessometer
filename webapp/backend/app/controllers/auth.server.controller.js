'use strict';

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('../app/models/user');

exports.authenticateUser = function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // TODO hash passwords
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                var token = jwt.sign(user, req.app.get('superSecret'), {
                    expiresInMinutes: 1440 // 24 hours
                });
                res.json({
                    success: true,
                    message: 'User authenticated!',
                    token: token
                });
            }   
        }
    });
};

exports.createExampleUser = function(req, res) {
    var example = new User({ 
        username: 'example', 
        password: 'password',
        name: { first:'User', last: 'Example' },
        email: 'example@example.com',
        createdBy: 'adminuser'
    });

    example.save(function(err) {
        if (err) throw err;
        console.log('User saved successfully');
        res.json({ success: true, message: 'Example user created!' });
    });
}