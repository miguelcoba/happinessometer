'use strict';

var base = require('../lib/base'),
    validate = require('validate.js'),
    jwt = require('jsonwebtoken'),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService),
    config = require('../../config/config');

module.exports = base.Resource.extend({
    post: function() {
        var self = this;

        var errors = validate(self.request.body, {
            email: {
                presence: true,
                email: true,
            },
            password: {
                presence: true
            }
        });

        if (errors) {
            return self.dispatchError(errors);
        }

        userService.findPendingUserOrUserByEmail(self.request.body.email, function(err, user) {
            // TODO handle error

            if (!user) {
                return self.dispatchNotFoundError('No user found with that email/password.');
            }

            if (user.status === 'pending') {
                return self.dispatchConflictError('User needs to be verified.');
            }

            if (!user.authenticate(self.request.body.password)) {
                return self.dispatchError('Authentication failed.');
            }

            var token = jwt.sign(user, config.secretKey, {
                expiresInMinutes: 1440 // expires in 24 hours
            });

            return self.response.json({ message: 'Enjoy your token!', token: token });
        })
    }
});