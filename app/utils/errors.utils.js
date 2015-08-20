'use strict';

module.exports.logError = function (error) {
    if (error && error.message) {
        console.log(chalk.red("Error: " + error.message));
    }
}

module.exports.error = function (settings) {
    var errSettings = settings || {},
        err = new Error(errSettings.message);
    if (errSettings.type) {
        err.type = errSettings.type;
    }
    logError(err);
    return err;
}

module.exports.errorWithType = function (error, type) {
    if (error instanceof Error) {
        error.type = type;
        logError(error);
        return error;
    }
    throw new Error('Error is not an error');
}

module.exports.handleMongoDBError = function (err, callback) {
    return callback(errorWithType(err, 'App.MongoDB'));
}

module.exports.handleEmailError = function (err, callback) {
    return callback(errorWithType(err, 'App.Email'));
}

module.exports.handleAppValidationError = function (message, callback) {
    return callback(error({
        message: message,
        type: 'App.Validation'
    }));
}