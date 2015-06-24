'use strict';
var base = require('../lib/base');

module.exports = base.Resource.extend({
	get: function(request, response) {
		return response.json([
			'César Ricardez',
			'Gerardo Galindez',
			'Manuel Zavaleta',
			'Rafael Gutierrez',
			'Raúl Vázquez',
			'Omar Martín'
		]);
	}
});