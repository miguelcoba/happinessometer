var moment = require('moment');

var PendingUser = require('../models/pendingUser');
var Company = require('../models/company');

UserService = function() {
};

/**
 * Create a new user into the application
 *
 * @param {newUser}
 * @param {adminUser}
 */
UserService.prototype.requestNewUser = function(newUserConfig, callback) {
    var self = this,
        newPendingUser,
        emailDomain;

    if (!newUserConfig) {
        return callback({
            message: 'New user configuration not provided.'
        });
    }

    if (newUserConfig && !newUserConfig.email) {
        return callback({
            message: 'New user email is required.'
        });
    }

    emailDomain = newUserConfig.email.substring(newUserConfig.email.indexOf('@'));
    console.log('domain: ' + emailDomain);
    Company.findOne({ domain: emailDomain }, function(err, company) {
        console.log('Company: ' + company);
        if (err) {
            return callback({
                message: 'Error trying to find the domain ' + emailDomain + '.',
                cause: err
            });
        }

        if (!company) {
            return callback({
                message: 'There is no domain registered for ' + emailDomain + '.'
            });
        }

        newPendingUser = new PendingUser({
            name: { first: newUserConfig.firstName, last: newUserConfig.lastName },
            email: newUserConfig.email,
            validUntil: moment().add(3, 'days'),
            code: self._generateValidationCode()
        });

        newPendingUser.save(function(err, createdPendingUser) {
            if (err) {
                return callback({
                    message: 'Error creating the new user request.',
                    cause: err
                });
            }
            //DomainEvents.fire('newUserRequested', createdPendingUser);
            callback(err, createdPendingUser);
        });
    });
};

UserService.prototype._generateValidationCode = function() {
    return moment().millisecond();
}

module.exports = function() {
    return new UserService();
}