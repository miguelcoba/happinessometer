'use strict';

var base = require('../lib/base'),
    moodService = require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    methods: ['post'],

    post: function() {
        var self = this;

        moodService.setMood({
            mood: self.request.body.mood,
            comment: self.request.body.comment
        }, function(err, newMood) {
            if (err) {
                return self.dispatchInternalServerError(err);
            }
            return self.response.json(newMood);
        });
    }
});