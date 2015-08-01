'use strict';

var base = require('../lib/base');
    moodService: require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    methods: ['post'],

    post: function(req, res) {
        var self = this;

        moodService.setMood({
            mood: req.body.mood,
            comment: req.body.comment
        }, function(err, newMood) {
            if (err) {
                return self.dispatchInternalServerError(err);
            }
            return res.json(newMood);
        });
    }
});