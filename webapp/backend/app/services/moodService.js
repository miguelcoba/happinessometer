var Mood = require('../models/mood');

MoodService = function() {
};

MoodService.prototype.setMood = function(moodConfig, callback) {
    if (!moodConfig) {
        return callback({
            message: 'No mood config provided.'
        });
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
    }
};

module.exports = function() {
    return new MoodService();
};
