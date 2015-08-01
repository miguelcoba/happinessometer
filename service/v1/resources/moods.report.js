'use strict';

var base = require('../lib/base'),
    moodService = require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    needsToken: ['get'],

    get: function() {
        var self = this;

        console.log(self.request.decoded);

        moodService.findAll(function(err, moods) {
            if (err) {
                return self.dispathError(err);
            }
            return self.response.json(moods);
        });
    }
});