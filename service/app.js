'use strict';
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var settings = require('./settings');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
	exposeHeaders: ['Location', 'Content-Length', 'Date']
}));

mongoose.connect(settings['MONGODB_CONNECTION_STRING'], {
	server: {
		socketOptions: {
			keepAlive: true
		}
	}
});

// api v1 router mounting
var api_v1 = require('./v1');
app.use('/v1/', api_v1);

// catch 404 and forward to error handler
app.use(function(request, response, continuation) {
	var error = new Error('Resource not found');
	error.status = 404;
	continuation(error);
});

// error handling
app.use(function(error, request, response, continuation) {
	response.status(error.status || 500);
	response.json({ message: error.message });
});


module.exports = app;