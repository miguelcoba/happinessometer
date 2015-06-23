'use strict';

var express = require('express');
var moods = require('../controllers/moods.server.controller');

var router = express.Router();

router.route('/moods')
    .post(/* TODO authentication, */moods.addMood);
