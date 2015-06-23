'use strict';

var moodService = require('../services/mood.service')();

exports.addMood = function(req, res) {
    moodService.setMood({
        mood: req.body.mood,
        comment: req.body.comment
    }, function(err, mood) {
        res.json({}); // TODO
    });
};

exports.getMoods = function(req, res) {
    res.json({});
};