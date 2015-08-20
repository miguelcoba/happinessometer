'use strict';

var mandrill = require('mandrill-api/mandrill'),
    config = require('../../config/config');

var EmailService = function() {
    this._client = null;
};

EmailService.prototype._getClient = function() {
    if(this._client == null)
        this._client = new mandrill.Mandrill('2pHj7TBidIt5EuzMHFNgsQ');
    return this._client;
};

EmailService.prototype._sendMessage = function(message, continuation) {
    message['from_email'] = config.email.from;
    message['from_name'] = config.email.name;

    var options = {
        message: message,
        async: true
    };

    this._getClient().messages.send(
        options,
        function(result) { console.log('r', result); continuation(null, result); },
        function(error) { console.log('e', error); continuation(error); }
    );
};

EmailService.prototype.sendConfirmationMessage = function(pendingUser, continuation) {
    var message = {
        html: '<strong>You are close!</strong>' +
              '<p>Please confirm your account at <a href="https://happinessometer-web.herokuapp.com/confirm?code=' +
              pendingUser.code +
              '">Happinessometer</a></p>' +
              '<p>Or if you want copy & paste this link in your browser https://happinessometer-web.herokuapp.com/confirm?code=' +
              pendingUser.code + '</p>',
        text: 'SORRY, NOT IMPLEMENTED',
        subject: 'Account confirmation',
        to: [{
            email: pendingUser.email,
            type: 'to'
        }]
    };

    this._sendMessage(message, continuation);
};

EmailService.prototype.sendWelcomeMessage = function(email, continuation) {
    var message = {
        html: '<strong>Welcome to the Magic!</strong>',
        text: 'SORRY, NOT IMPLEMENTED',
        subject: 'Your account is enabled!',
        to: [{
            email: email,
            type: 'to'
        }]
    };

    this._sendMessage(message, continuation);
};

// Singleton
module.exports = new EmailService();