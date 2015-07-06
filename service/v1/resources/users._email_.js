'use strict';

var base = require('../lib/base'),
    userService = require('../../app/services/user.service')();

module.exports = base.Resource.extend({
    methods: ['get'],

    get: function(req, res) {
        var self = this,
            json;

        userService.findPendingUserOrUserByEmail(req.params.email, function(err, user) {
            if (err) {
                // TODO handle error
                return self.dispatchInternalServerError(err);
            }

            if (!user) {
               return self.dispatchNotFoundError('No user found with email ' + req.params.email); 
            }

            json = {
                status: user.status,
                email: user.email
            };
            if (user.status === 'user') {
                json.firstName = user.name.first;
                json.lastName = user.name.last;
            }
            return res.json(json);
        });
    }
});