var express = require('express');
var User = require('../app/models/user');

var router = express.Router();

router.route('/users')
    .post(function(req, res) {
        // TODO hash the password
        var newUser = new User({ 
            username: req.body.username, 
            password: req.body.password,
            name: {
                first: req.body.firstName,
                last: req.body.lastName
            },
            email: req.body.lastName
        });

        newUser.save(function(err, dbUser) {
            res.json({ success: true, message: 'User created!' });
        });
    });

module.exports = router;