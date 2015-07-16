'use strict';
var mandrill = require('mandrill-api/mandrill');


var Email = function() {
	this._client = null;
};

Email.prototype = {
	getClient: function() {
		if(this._client == null)
			this._client = new mandrill.Mandrill('2pHj7TBidIt5EuzMHFNgsQ');
		return this._client;
	},

	sendMessage: function(message, continuation) {
		message['from_email'] = 'hello@happinessometer.com';
		message['from_name'] = 'Happinessometer Service';

		var options = {
			message: message,
			async: true
		};

		this.getClient().messages.send(
			options,
			function(result) { console.log('r', result); continuation(null, result); },
			function(error) { console.log('e', error); continuation(error); }
		);
	},

	sendConfirmationMessage: function(user, continuation) {
		var message = {
			html: '<strong>Welcome to the Magic!</strong>',
			text: 'SORRY, NOT IMPLEMENTED',
			subject: 'Account confirmation',
			to: [{
				email: user.email,
				name: user.name,
				type: 'to'
			}]
		};

		this.sendMessage(message, continuation);
	}
};


module.exports = Email;