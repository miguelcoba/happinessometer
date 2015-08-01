'use strict';

var base = require('../lib/base'),
    companyService = require('../../app/services/company.service')();

module.exports = base.Resource.extend({
    methods: ['get'],

    get: function(req, res) {
        var self = this;
        
        companyService.findWithDomain(req.params.domain, function(err, company) {
            if (err) {
                return self.dispatchInternalServerError(err);
            }

            if (!company) {
                return self.dispatchNotFoundError('No Company with domain ' + req.params.domain);
            }

            return res.json({
                name: company.name,
                domain: company.domain
            });
        });
    }
});