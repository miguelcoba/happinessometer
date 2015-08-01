'use strict';

var base = require('../lib/base'),
    validate = require('validate.js'),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService);

module.exports = base.Resource.extend({
    post: function() {
        var self = this,
            json;

        var errors = validate(this.request.body, {
            email: {
                presence: true,
                email: true
            }
        });

        if (errors) {
            return self.dispatchBadRequestError(errors);
        }

        var user = {
            email: this.request.body.email
        }; 

        userService.requestNewUser(user, function(err, newUser) {
            if (err) {
                return self.dispatchError(err);
            }

            return self.response.location('/users/' + newUser.email).status(201).send(null);
        });
    }
});