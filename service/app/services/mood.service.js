'use strict';

var _ = require('lodash'),
    Mood = require('../models/mood');

var MoodService = function() {
};

MoodService.prototype.setMood = function(moodConfig, callback) {
    if (!moodConfig || !moodConfig.mood || !moodConfig.comment) {
        return callback({
            message: 'No mood values provided.'
        });
    }

    var newMood = Mood({
        mood: moodConfig.mood.toLowerCase(),
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
MoodService.prototype.findAllWithPage = function(page, callback) {
    var perPage = 30;

    Mood.find()
        .limit(perPage)
        .skip(perPage * (page - 1))
        .sort({
            createdAt: 'desc'
        })
        .exec(function (err1, moods) {
            if (err1) {
                return callback({
                    message: 'Error trying to get all moods',
                    cause: err1
                });
            }
            Mood.count().exec(function(err2, count) {
                if (err2) {
                    return callback({
                        message: 'Error counting all moods',
                        cause: err2
                    });
                }
                callback(null, moods, _.ceil(count / perPage), count);
            });
        });
};

MoodService.prototype.findAll = function(callback) {
    var perPage = 30;

    Mood.find()
        .exec(function (err1, moods) {
            if (err1) {
                return callback({
                    message: 'Error trying to get all moods',
                    cause: err1
                });
            }
            callback(null, moods);
        });
};

MoodService.prototype.quantityReport = function(callback) {
    this.findAll(function(err, moods) {
        if (err) {
            return callback({
                message: err.message
            });
        }

        Mood.aggregate({
            $group: {
                _id: '$mood',
                mood: { $first: '$mood' },
                quantity: { $sum: 1 }
            }
        }).exec(function(error, result) {
            if(error) return callback(error);
            return callback(null, result);
        });
    });
};

MoodService.prototype.hashtagReport = function(callback) {
    this.findAll(function(err, moods) {
        if (err) {
            return callback({
                message: err.message
            });
        }

        callback(null, {
            hashtags: [{
                hashtag: '#yolo',
                quantity: 1000,
                moods: [{
                    mood: 'happy',
                    quantity: 500
                },{
                    mood: 'sad',
                    quantity: 300
                },{
                    mood: 'normal',
                    quantity: 200
                }]
            },{
                hashtag: '#freedomhackday',
                quantity: 500,
                moods: [{
                    mood: 'happy',
                    quantity: 300
                },{
                    mood: 'sad',
                    quantity: 100
                },{
                    mood: 'normal',
                    quantity: 100
                }]
            },{
                hashtag: '#java',
                quantity: 1340,
                moods: [{
                    mood: 'happy',
                    quantity: 340
                },{
                    mood: 'sad',
                    quantity: 500
                },{
                    mood: 'normal',
                    quantity: 500
                }]
            },{
                hashtag: '#java',
                quantity: 1340,
                moods: [{
                    mood: 'happy',
                    quantity: 340
                },{
                    mood: 'sad',
                    quantity: 500
                },{
                    mood: 'normal',
                    quantity: 500
                }]
            }]
        });
    });
}

module.exports = function() {
    return new MoodService();
};
