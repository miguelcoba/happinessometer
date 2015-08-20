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

function logError(error) {
    if (error && error.message) {
        console.log(chalk.red("Error: " + error.message));
    }
}

function error(settings) {
    var errSettings = settings || {},
        err = new Error(errSettings.message);
    if (errSettings.type) {
        err.type = errSettings.type;
    }
    logError(err);
    return err;
}

function errorWithType(error, type) {
    if (error instanceof Error) {
        error.type = type;
        logError(error);
        return error;
    }
    throw new Error('Error is not an error');
}

function handleMongoDBError(err, callback) {
    return callback(errorWithType(err, 'App.MongoDB'));
}

function handleEmailError(err, callback) {
    return callback(errorWithType(err, 'App.Email'));
}

function handleAppValidationError(message, callback) {
    return callback(error({
        message: message,
        type: 'App.Validation'
    }));
}

/**
 * Create a new request to create a user into the application
 *
 * @param {newUser}
 * @param {callback}
 */
UserService.prototype.requestNewUser = function(newUserSettings, callback) {
    var self = this,
        newPendingUser,
        emailDomain;

    if (!newUserSettings) {
        return handleAppValidationError('New user configuration not provided.', callback);
    }

    if (newUserSettings && !newUserSettings.email) {
        return handleAppValidationError('New user email is required.', callback);
    }

    emailDomain = newUserSettings.email.substring(newUserSettings.email.indexOf('@'));
    Company.findOne({ domain: emailDomain }, function(err, company) {
        if (err) {
            return handleMongoDBError(err, callback);
        }

        if (!company) {
            return handleAppValidationError(
                'There is no domain registered for ' + emailDomain + '.', callback);
        }

        PendingUser.findOne({ email: newUserSettings.email }, function(err, npu) {
            if (err) {
                return handleMongoDBError(err, callback);
            }

            if (npu) {
                return handleAppValidationError(
                    'There is a pending user with ' + newUserSettings.email + ' email', callback);
            }

            newPendingUser = new PendingUser({
                email: newUserSettings.email,
                code: randomstring.generate(35)
            });

            newPendingUser.save(function(err, pendingUser) {
                if (err) {
                    return handleMongoDBError(err, callback);
                }

                // TODO rgutierrez send email as a domain event
                self._emailService.sendConfirmationMessage(pendingUser, function(err) {
                    if (err) {
                        return handleEmailError('Error sending the confirmation email.', callback);
                    }

                    callback(err, pendingUser);
                });
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