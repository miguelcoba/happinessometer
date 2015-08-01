'use strict';

var base = require('../lib/base'),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService);

module.exports = base.Resource.extend({
    get: function() {
        var self = this,
            json;

        userService.findPendingUserOrUserByEmail(self.request.params.email, function(err, user) {
            if (err) {
                // TODO handle error
                return self.dispatchInternalServerError(err);
            }

            if (!user) {
               return self.dispatchNotFoundError('No user found with email ' + self.request.params.email); 
            }

            json = {
                status: user.status,
                email: user.email
            };
            if (user.status === 'user') {
                json.firstName = user.name.first;
                json.lastName = user.name.last;
                json.username = user.username;
            }
            return self.response.json(json);
        });
    }
});