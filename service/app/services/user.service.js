'use strict';

var moment = require('moment'),
    chalk = require('chalk'),
    PendingUser = require('../models/pendingUser'),
    Company = require('../models/company'),
    User = require('../models/user'),
    emailService = require('../services/email.service'),
    randomstring = require('randomstring');

var UserService = function(emailService) {
    this._emailService = emailService;
};

/**
 * Create a new request to create a user into the application
 *
 * @param {newUser}
 * @param {callback}
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
    Company.findOne({ domain: emailDomain }, function(err, company) {
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
            email: newUserConfig.email,
            code: randomstring.generate(35)
        });

        newPendingUser.save(function(err, pendingUser) {
            if (err) {
                return callback({
                    message: 'Error creating the new user request.',
                    cause: err
                });
            }
            // TODO rgutierrez send email as a domain event
            self._emailService.sendConfirmationMessage(pendingUser, function(err) {
                if (err) {
                    return callback({
                        message: 'Error sending the confirmation email.',
                        cause: err
                    })
                }
                callback(err, pendingUser);
            });
        });
    });
};

/**
 * Takes an {code} that was created when a new user was requested and creates a user 
 * into the application.
 *
 * @param {code} Code to create a user from a pending user entry
 * @param {callback}
 */
UserService.prototype.createUserUsingCode = function(code, userConfig, callback) {
    var self = this,
        user;
    PendingUser.findOne({ code: code }, function(err, pendingUser) {
        if (err) {
            return callback({
                message: 'Error trying to find the pending user with code ' + code,
                cause: err
            });
        }

        if (!pendingUser) {
            return callback({
                message: 'There is no pending user with code ' + code
            });
        }

        if (moment().diff(pendingUser.validUntil, 'days') > 3) {
            return callback({
                message: 'There is no valid pending user with code ' + code
            });
        }

        user = new User({
            email: pendingUser.email,
            username: userConfig.username,
            password: userConfig.password,
            name: {
                first: userConfig.firstName,
                last: userConfig.lastName
            },
            enabled: true
        })

        user.save(function(err, userSaved) {
            if (err) {
                return callback({
                    message: 'Error creating new user',
                    cause: err
                });
            }

            self._emailService.sendWelcomeMessage(userSaved.email, function(err) {
                if (err) {
                    return callback({
                        message: 'Error sending the welcome email.',
                        cause: err
                    })
                }
                callback(err, userSaved);
            });
        });
    });
};

UserService.prototype.findPendingUserOrUserByEmail = function(email, callback) {
    User.findOne({ email: email }, function(err, user) {
        // TODO handling error

        if (user) {
            user.status = 'user';
            return callback(err, user);
        } else {
            PendingUser.findOne({ email: email }, function(err, user) {
                if (user) {
                    user.status = 'pending';
                }
                return callback(err, user);
            });
        }
    })
};

UserService.prototype.findPendingUserByCode = function(code, callback) {
    PendingUser.findOne({ code: code }, function(err, pendingUser) {
        // TODO handling error

        if (!pendingUser) {
            return callback({
                message: 'There is pending user with that code.'
            });
        }
        return callback(err, pendingUser);
    })
};

module.exports = function(emailService) {
    return new UserService(emailService);
};