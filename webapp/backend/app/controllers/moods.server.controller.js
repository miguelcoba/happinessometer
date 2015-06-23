'use strict';

var moodService = require('../services/mood.service')();

exports.addMood = function(req, res) {
    moodService.setMood({
        mood: req.body.mood,
        comment: req.body.comment
    })
    res.json({});
};

exports.getMoods = function(req, res) {
    res.json({});
};