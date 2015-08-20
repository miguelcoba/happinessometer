'use strict';

var base = require('../lib/base'),
    moment = require('moment'),
    validate = require('validate.js'),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService);

module.exports = base.Resource.extend({
    get: function() {
        var self = this;

        var errors = validate({ code: self.request.query.code }, {
            code: {
                presence: true
            }
        });

        if (errors) {
            return that.dispatchValidationErrors("There are errors", errors);
        }

        userService.findPendingUserByCode(self.request.query.code, function(err, user) {
            if (err) {
                return self.dispatchError(err);
            }

            if (!user) {
               return self.dispatchNotFoundError('Code not found.'); 
            }

            if (!user.isValid(moment())) {
                return self.dispatchConflictError({
                    message: 'Code is not valid.'
                });
            }

            return self.response.json(user.toJSON());
        });
    },

    post: function() {
        var self = this;

        var errors = validate(self.request.body, {
            code: {
                presence: true
            },
            email: {
                presence: true,
                email: true,
            },
            firstName: {
                presence: true
            },
            lastName: {
                presence: true
            },
            username: {
                presence: true
            },
            password: {
                presence: true
            }
        });

        if (errors) {
            return self.dispatchBadRequestError(errors);
        }

        userService.createUserUsingCode(self.request.body.code, self.request.body, function(err, newUser) {
            if (err) {
                return self.dispatchError(err);
            }

            return self.response.location('/users/' + newUser.email).status(201).send(null);
        });
    }
});