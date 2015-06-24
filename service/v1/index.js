'use strict';

var _ = require('lodash');
var fs = require('fs');
var express = require('express');

var MODULES_TO_MOUNT = [];
var EXCLUDED_FILES = ['base.js', 'index.js'];

_.each(fs.readdirSync(process.cwd() + '/v1'), function(file) {
	if(!_.contains(EXCLUDED_FILES, file) && _.last(file.split('.')) == 'js') {
		var module_name = _.initial(file.split('.')).join('.');
		MODULES_TO_MOUNT.push(module_name);
	}
});

var router = express.Router();

_.each(MODULES_TO_MOUNT.sort().reverse(), function(module_name) {
	/* get the class module of the module to mount */
	var resource_class = require(process.cwd() + '/v1/' + module_name);
	/* map the resource according to simple rules */
	var path = '/:team';

	_.each(module_name.split('.'), function(fragment) {
		if(fragment.charAt(0) == '_' && fragment.charAt(fragment.length - 1) == '_') {
			var param = fragment.substring(1, fragment.length - 1);
			if(param == 'id') {
				throw new Error('The :id param is reserved for resource identifier.');
			}
			path += '/:' + param;
		}
		else {
			path += '/' + fragment;
		}
	});

	path += '/:id?';

	router.all(path, function(request, response, continuation) {
		var resource_instance = new resource_class(request, response);
		resource_instance.dispatch();
	});

	console.log('v1%s resource mounted', path);
});

module.exports = router;