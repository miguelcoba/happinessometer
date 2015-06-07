var express = require('express');
var Mood = require('../app/models/mood');

var router = express.Router();

// API
// POST /api/login
// POST /api/logout
// GET /api/user

// GET /api/mood
// GET /api/mood/company
// GET /api/mood/team/:teamId
// GET /api/mood/user

// POST /api/user/mood
// DELETE /api/user/mood/:moodEntryId
// UPDATE /api/user/mood/:moodEntryId
// GET /api/mood/report

router.route('/mood')
    .get(function(req, res) {
        res.json({});
    });

router.route('/company')
    .get(function(req, res) {
        res.json({});
    });

router.route('/team')
    .get(function(req, res) {
        res.json({});
    });

router.route('/team/:teamId')
    .get(function(req, res) {
        res.json({});
    });

router.route('/user/popularity')
    .get(function(req, res) {
        res.json({});
    });

router.route('/user/mood')
    .post(function(req, res) {
        var mood = new Mood();
        mood.description = req.body.description;
        mood.mood = req.body.mood;
        mood.createdAt = new Date();

        mood.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'Mood updated!'
            });
        });
    })
    .get(function(req, res) {
        Mood.find(function(err, moods) {
            if (err) {
                res.send(err);
            }
            res.json(moods);
        });
    });

module.exports = router;