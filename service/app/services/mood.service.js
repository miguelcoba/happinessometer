'use strict';

var Mood = require('../models/mood');

var MoodService = function() {
};

MoodService.prototype.setMood = function(moodConfig, callback) {
    if (!moodConfig || !moodConfig.mood || !moodConfig.comment) {
        return callback({
            message: 'No mood values provided.'
        });
    }

    var newMood = Mood({
        mood: moodConfig.mood,
        comment: moodConfig.comment
    });

    newMood.save(function(err, mood) {
        if (err) {
            return callback({
                message: 'Error saving mood',
                cause: err
            });
        }
        callback(err, mood);
    });
};

// TODO this needs pagination or something
MoodService.prototype.findAll = function(callback) {
    Mood.find({}, function(err, moods) {
        if (err) {
            return callback({
                message: 'Error trying to get all moods',
                cause: err
            });
        }

        callback(null, moods);
    });
};

MoodService.prototype.report = function(callback) {
    this.findAll(function(err, moods) {
        if (err) {
            return callback({
                message: err.message
            });
        }

        callback(null, {
            company: [{
                mood: 'happy',
                ratio: 0.5
            },{
                mood: 'normal',
                ratio: 0.2
            },{
                mood: 'sad',
                ratio: 0.5
            }]
        });
    });
}

module.exports = function() {
    return new MoodService();
};
