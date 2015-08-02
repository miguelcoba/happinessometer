'use strict';

var base = require('../lib/base'),
    moodService = require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    needsToken: ['get'],

    get: function() {
        var self = this;

        moodService.quantityReport(function(error, aggregation) {
            if (error) return self.dispatchError(error);
            return self.response.json(aggregation);
        });
    }
});