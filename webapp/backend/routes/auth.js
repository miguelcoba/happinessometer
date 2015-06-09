var express = require('express');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var User = require('../app/models/user');

var router = express.Router();

router.route('/auth')
    .post(function(req, res) {
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
    });

router.route('/auth/example')
    .get(function(req, res) {
        var example = new User({ 
            username: 'example', 
            password: 'password',
            name: { first:'User', last: 'Example' },
            email: 'example@example.com'
        });

        example.save(function(err) {
            if (err) throw err;
            console.log('User saved successfully');
            res.json({ success: true, message: 'Example user created!' });
        });
});



module.exports = {
    router: router,
    verifyToken: function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    }
};