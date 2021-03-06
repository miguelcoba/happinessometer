'use strict';
var _ = require('lodash'),
	extend = require('bextend'),
	config = require('../../config/config'),
	jwt = require('jsonwebtoken');


var errors = {
	BadRequestError: function(message) {
		this.message = message;
		this.status = 400;
	},

	ValidationBadRequestError: function(message, fieldErrors) {
		this.message = message;
		this.errors = fieldErrors;
		this.status = 400;
	},

	NotFoundError: function(message) {
		this.message = message;
		this.status = 404;
	},

	ConflictError: function(message) {
		this.message = message;
		this.status = 409;
	},

	InternalError: function(message) {
		this.message = message;
		this.status = 500;
	},

	UnauthorizedError: function(message) {
		this.message = message;
		this.status = 401;
	},

	NotAllowedError: function(message) {
		this.message = message;
		this.status = 405;
	}
};

_.each(_.keys(errors), function(key) {
	errors[key].prototype = new Error();
});

var Resource = function(request, response, continuation) {
	this.request = request;
	this.response = response;
	this.continuation = continuation;
};

_.extend(Resource.prototype, {
	methods: ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'],
	needsToken: [],

	dispatch: function() {
		this.response.set('Content-Type', 'application/json; charset=utf-8');
		/**
		 * we should dispatch the incoming request based on the used method, if the method
		 * is not implemented by the resource we will send a "Method not allowed" response
		 * with the "Allow" headers containing the list of implemented methods for that
		 * resource
		 */
		var that = this;
		var method = this.request.method.toLowerCase();

		if(this[method] && this[method].constructor === Function) {
			if (this.needsToken.indexOf(method) >= 0) {
				this.validateToken(function() {
					that[method].apply(that, [
						that.request,
						that.response,
						that.continuation
					]);
				});
			} else {
				this[method].apply(this, [
					this.request,
					this.response,
					this.continuation
				]);
			}
		}
		else {
			var implemented_methods = [];
			_.each(this.methods, function(test_method) {
				if(that[test_method] && that[test_method].constructor === Function)
					implemented_methods.push(test_method.toUpperCase());
			});
			this.response.set('Allow', implemented_methods.join(', '));
			this.dispatchError(new errors.NotAllowedError());
		}
	},

	validateToken: function(next) {
		var self = this;

		// check header or url parameters or post parameters for token
		var token =
			self.request.body.token ||
			self.request.query.token ||
			self.request.headers['x-access-token'];

		if (!token) {
			var authorization = this.request.get('Authorization');
			if (authorization) {
				authorization = authorization.split(' ');
				var scheme = authorization[0];
				if(scheme != 'Token') {
					this.dispatchError(new errors.BadRequestError());
				}
				token = authorization[1];
			}
		}

		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, config.secretKey, function(err, decoded) {
				if (err) {
					return self.dispatchUnauthorizedError('Failed to authenticate token.');
				} else {
				// if everything is good, save to request for use in other routes
					self.request.decoded = decoded;
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return self.dispatchBadRequestError('No token provided.');
		}
	},

	dispatchError: function(error) {
		var errorMessage = {};
		if (error.message) {
			errorMessage.message = error.message
		}
		if (error.type) {
			errorMessage.type = error.type;
		}
		if (error.errors) {
			errorMessage.errors = error.errors;
		}
		this.response.status(error.status || 500).send(errorMessage);
	},

	abort: function(error) {
		this.dispatchError(error);
	},

	dispatchInternalServerError: function(error) {
		this.dispatchError(new errors.InternalError(error.message));
	},

	dispatchNotFoundError: function(error) {
		this.dispatchError(new errors.NotFoundError(error.message || error));
	},

	dispatchSuccessfulResourceCreation: function(resourceIdentifier) {
		this.response.setHeader('Location', 'http://algo/' + resourceIdentifier);
		this.response.status(201).send(null);
	},

	dispatchBadRequestError: function(error) {
		this.dispatchError(new errors.BadRequestError(error.message || error));
	},

	dispatchValidationErrors: function(message, fieldErrors) {
		this.dispatchError(new errors.ValidationBadRequestError(message, fieldErrors));
	},

	dispatchConflictError: function(error) {
		this.dispatchError(new errors.ConflictError(error.message));
	},

	dispatchUnauthorizedError: function(error) {
		this.dispatchError(new errors.UnauthorizedError(error.message));
	},

	handleError: function(error) {
		if (error.type) {
			if (error.type === 'App.Validation') {
				return this.dispatchBadRequestError(error);
			}
		}
		return this.dispatchError(error);
	}
});


// assigning the extend function to every resource class in the base library
Resource.extend = extend;

// module exports
module.exports.Resource = Resource;
module.exports.errors = errors;
