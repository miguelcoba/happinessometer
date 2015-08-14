'use strict';

var base = require('../lib/base'),
    moodService = require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    needsToken: ['post', 'get'],

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
    },

    get: function() {
        var self = this;
            page = self.request.params.page;

        console.log(self.request.decoded);

        moodService.findAll(page, function(err, moods, totalPages, moodsCount) {
            if (err) {
                return self.dispathError(err);
            }
            return self.response.json({
                moods: moods,
                pagination: {
                    page: page,
                    totalPages: totalPages,
                    totalItems: moodsCount
                }
            });
        });
    }
});