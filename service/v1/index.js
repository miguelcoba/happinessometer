'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    express = require('express'),
    chalk = require('chalk'),
    modules_to_mount = [];

_.each(fs.readdirSync(process.cwd() + '/v1/resources'), function(file) {
	if(_.last(file.split('.')) === 'js') {
		var module_name = _.initial(file.split('.')).join('.');
		modules_to_mount.push(module_name);
	}
});

var router = express.Router();

_.each(modules_to_mount.sort().reverse(), function(module_name) {
	/* get the class module of the module to mount */
	var resource_class = require(process.cwd() + '/v1/resources/' + module_name);
	/* map the resource according to simple rules */
	var path = '/:team';

	_.each(module_name.split('.'), function(fragment) {
		if(fragment.charAt(0) === '_' && fragment.charAt(fragment.length - 1) === '_') {
			var param = fragment.substring(1, fragment.length - 1);
			if(param === 'id') {
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

	console.log(chalk.blue('v1%s resource mounted', path));
});

module.exports = router;