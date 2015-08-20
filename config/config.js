'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    glob = require('glob'),
    fs = require('fs');

/**
 * Resolve environment configuration by extending each env configuration file,
 * and lastly merge/override that with any local repository configuration that exists
 * in local.js
 */
var resolvingConfig = function() {
    var conf = {};

    conf = _.extend(
        require('./env/all'),
        {}
    );

    return _.merge(conf, (fs.existsSync('./config/env/local.js') && require('./env/local.js')) || {});
};

/**
 * Load app configurations
 */
module.exports = resolvingConfig();