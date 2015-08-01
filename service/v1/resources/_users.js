'use strict';
var _ = require('lodash');
var validate = require('validate.js');
var base = require('../lib/base');
var User = require('../models/User');
var Email = require('../services/email');


module.exports = base.Resource.extend({
	get: function() {
		var projection = {
			email: true,
			name: true,
			confirmed: true
		};

		var that = this;

		User.find({}, projection, function(error, users) {
			if(error) return that.dispatchError(error);
			return that.response.json(users);
		});
	},

	post: function() {
		var payload = this.request.body;

		var errors = validate(payload, {
			email: {
				presence: true,
				email: true
			},
			password: {
				presence: true,
				length: { minimum: 4 }
			},
			name: {
				presence:  true,
				length: { minimum: 2 }
			}
		});

		if(errors) {
			return this.dispatchError(
				new base.errors.BadRequestError(errors)
			);
		}

		var user = new User(payload);
		var that = this;

		user.hashPassword(function(error) {
			if(error) return that.dispatchError(error);

			user.save(function(error, user) {
				if(error) return that.dispatchError(error);

				var email = new Email();

				email.sendConfirmationMessage(user, function(error) {
					if(error) return that.dispatchError(error);

					return that.response.location(
						'/users/' + user.id
					).status(201).send(null);
				});
			});
		});
	}
});
