'use strict';

var base = require('../lib/base'),
    validate = require('validate.js'),
    jwt = require('jsonwebtoken'),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService),
    config = require('../../config/config');

module.exports = base.Resource.extend({
    post: function() {
        var that = this;

        var errors = validate(that.request.body, {
            email: {
                presence: true,
                email: true,
            },
            password: {
                presence: true
            }
        });

        if (errors) {
            return that.dispatchValidationErrors("There are errors", errors);
        }

        userService.findPendingUserOrUserByEmail(that.request.body.email, function(err, user) {
            if (err) {
                return self.handleError(err);
            }

            if (!user) {
                return that.dispatchNotFoundError('No user found with that email/password.');
            }

            if (user.status === 'pending') {
                return that.dispatchBadRequestError('User needs to be verified.');
            }

            if (!user.authenticate(that.request.body.password)) {
                return that.dispatchBadRequestError('Authentication failed.');
            }

            var token = jwt.sign(user, config.secretKey, {
                expiresInMinutes: 1440 // expires in 24 hours
            });

            return that.response.json({ message: 'Enjoy your token!', token: token });
        })
    }
});