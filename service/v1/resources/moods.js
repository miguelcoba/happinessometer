'use strict';

var base = require('../lib/base'),
    moodService = require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    needsToken: ['post', 'get'],

    post: function() {
        console.log(this.request);
        console.log(this.request.get("Authorization"));
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
    },

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