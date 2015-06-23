var Company = require('../models/company');

CompanyService = function() {
};

CompanyService.prototype.createNewCompany = function(newCompanyConfig, callback) {
    // TODO validate nweCompanyConfig

    var newCompany = new Company({
        name: newCompanyConfig.name,
        domain: newCompanyConfig.domain
    });

    newCompany.save(function(err, companyCreated) {
        if (err) {
            return callback({
                message: 'Error creating the Company ' + newCompanyConfig.name + '.',
                cause: err
            });
        }

        callback(err, companyCreated);
    })
};

CompanyService.prototype.deleteWithDomain = function(domainName, callback) {
    Company.findOne({ domain: domainName}, function(err, company) {
        if (err) {
            return callback({
                message: 'Error finding Company with domain ' + domainName + '.',
                cause: err
            });
        }
        console.log('Company: ' + company);
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

module.exports = function() {
    return new CompanyService();
}