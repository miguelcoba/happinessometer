'use strict';

var base = require('../lib/base'),
    companyService = require('../../app/services/company.service')();

module.exports = base.Resource.extend({
    post: function(req, res) {
        var self = this;
        
        companyService.createNewCompany({
            name: self.request.body.name,
            domain: self.request.body.domain
        }, function(err, company) {
            if (err) {
                return self.dispatchInternalServerError(err);
            }
            return self.dispatchSuccessfulResourceCreation(company.domain);
        });
    }
});