'use strict';

var _ = require('lodash'),
    moment = require('moment'),
    Mood = require('../models/mood'),
    errorsUtils = require('../utils/errors.utils');

var MoodReportService = function() {
};

MoodReportService.prototype.overallMood = function(callback) {
    Mood.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: moment.utc("2015-08-20").toDate()
                }
            }
        },
        {
            $group: {
                _id: '$mood',
                mood: { $first: '$mood' },
                quantity: { $sum: 1 }
            }
        }
    ]).exec(function(err, result) {
        if (err) {
            return errorsUtils.handleMongoDBError(err, callback);
        }
        return callback(null, result);
    });
};

module.exports = function() {
    return new MoodReportService();
};