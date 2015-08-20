'use strict';

var base = require('../lib/base'),
    validate = require('validate.js'),
    companyService = require('../../app/services/company.service')(),
    emailService = require('../../app/services/email.service'),
    userService = require('../../app/services/user.service')(emailService);

module.exports = base.Resource.extend({
    needsToken: ['get'],

    get: function() {
        var self = this,
            user = self.request.decoded,
            domain = user.email.substring(user.email.indexOf('@'));
        companyService.findWithDomain(domain, function(err, company) {
            if (err) {
                return self.dispatchError(err);
            }

            if (!company) {
                return self.dispatchNotFoundError('No Company with domain ' + domain);
            }

            return self.response.json({
                email: user.email,
                firstName: user.name.first,
                lastName: user.name.last,
                company: {
                    name: company.name,
                    domain: company.domain
                }
            });
        });
    }
});