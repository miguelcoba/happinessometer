'use strict';

var base = require('../lib/base'),
    userService = require('../../app/services/user.service')();

module.exports = base.Resource.extend({
	methods: ['put', 'post'],

	post: function(req, res) {
		var self = this;

		userService.requestNewUser({
			email: req.body.email
		}, function(err, newPendingUser) {
			if (err) {
				return self.dispatchInternalServerError(err);
			}
			return res.json(newPendingUser);
		});
	}
});