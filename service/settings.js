'use strict';

var settings = [
	'MONGODB_CONNECTION_STRING',
	'SECRET_KEY'
];

module.exports = settings.reduce(function(memo, item) {
	var value = process.env['HAPPINESSOMETER_' + item];
	memo[item] = value !== void 0 ? value : null;
	return memo;
}, {});