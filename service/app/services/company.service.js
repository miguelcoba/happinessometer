'use strict';

var Company = require('../models/company'),
    validate = require('validate.js');

var CompanyService = function() {
};

CompanyService.prototype.createNewCompany = function(newCompanyConfig, callback) {
    var errors = validate(newCompanyConfig, {
        name: { presence:  true},
        domain: { presence: true }
    });

    if (errors) {
        return callback(errors);
    }

    var newCompany = new Company({
        name: newCompanyConfig.name,
        domain: newCompanyConfig.domain
    });

    newCompany.save(function(err, company) {
        if (err) {
            return callback({
                message: 'Error creating the Company ' + newCompanyConfig.name + '.',
                cause: err
            });
        }

        callback(err, company);
    });
};

CompanyService.prototype.deleteWithDomain = function(domainName, callback) {
    Company.findOne({ domain: domainName }, function(err, company) {
        if (err) {
            return callback({
                message: 'Error finding Company with domain ' + domainName + '.',
                cause: err
            });
        }

        if (!company) {
            return callback({
                message: 'No Company with domain ' + + domainName + ' was found.'                
            });
        }

        Company.remove({ _id: company._id }, function(err) {
            if (err) {
                return callback({
                    message: 'Error deleting Company with domain ' + domainName + '.',
                    cause: err
                });
            }
            callback();
        });
    });
};

CompanyService.prototype.findWithDomain = function(domainName, callback) {
    Company.findOne({ domain: domainName }, function(err, company) {
        if (err) {
            return callback({
                message: 'Error finding the Company with domain ' + domainName + '.',
                cause: err
            });
        }

        return callback(err, company);
    });
};


module.exports = function() {
    return new CompanyService();
}