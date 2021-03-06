'use strict';

var base = require('../lib/base'),
    validate = require('validate.js'),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService),
    companyService = require('../../app/services/company.service')(emailService);

module.exports = base.Resource.extend({
    needsToken: ['get'],

    post: function() {
        var that = this,
            json;

        var errors = validate(this.request.body, {
            email: {
                presence: true,
                email: true
            }
        });

        if (errors) {
            return that.dispatchValidationErrors("There are errors", errors);
        }

        var user = {
            email: this.request.body.email
        }; 

        userService.requestNewUser(user, function(err, newUser) {
            if (err) {
                return that.handleError(err);
            }

            return that.response.location('/users/' + newUser.email).status(201).send(null);
        });
    },

    get: function() {
        var that = this,
            user = that.request.decoded,
            domain = user.email.substring(user.email.indexOf('@'));

        companyService.findAllUsersInCompany(domain, function(err, users) {
            if (err) {
                return that.handleError(err);
            }
            return that.response.json(users);
        })
    }
});