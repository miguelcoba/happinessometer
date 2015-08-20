'use strict';

var base = require('../lib/base'),
    companyService = require('../../app/services/company.service')();

module.exports = base.Resource.extend({
    get: function() {
        var self = this;
        
        companyService.findWithDomain(self.request.params.domain, function(err, company) {
            if (err) {
                return self.dispatchInternalServerError(err);
            }

            if (!company) {
                return self.dispatchNotFoundError('No Company with domain ' + req.params.domain);
            }

            return self.response.json(company.toJSON());
        });
    }
});