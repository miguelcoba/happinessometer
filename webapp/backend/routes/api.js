var express = require('express');
var Mood = require('../app/models/mood');

var router = express.Router();

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