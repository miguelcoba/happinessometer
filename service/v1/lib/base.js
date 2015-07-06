'use strict';

var _ = require('lodash'),
    extend = require('bextend');

function returnMessage(error) {
	if (error) {
		if (typeof error === 'string') {
			return error;
		} else {
			return error.message;
		}
	}
	return '';
}

var errors = {
	BadRequestError: function(error) {
		this.message = returnMessage(error);
		this.status = 400;
	},

	NotFoundError: function(error) {
		this.message = returnMessage(error);
		this.status = 404;
	},

	ConflictError: function(error) {
		this.message = returnMessage(error);
		this.status = 409;
	},

	InternalError: function(error) {
		this.message = returnMessage(error);
		this.status = 500;
	},

	UnauthorizedError: function(error) {
		this.message = returnMessage(error);
		this.status = 401;
	},

	NotAllowedError: function(error) {
		this.message = returnMessage(error);
		this.status = 405;
	}
};

_.each(errors, function(error) {
	error.prototype = new Error();
});

var Resource = function(request, response, continuation) {
	this.request = request;
	this.response = response;
	this.continuation = continuation;
};

_.extend(Resource.prototype, {
	methods: ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'],

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
			this[method].apply(this, [
				this.request,
				this.response,
				this.continuation
			]);
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

	dispatchError: function(error) {
		this.response.status(error.status || 500).send(error.message ? {
			message: error.message
		} : null);
	},

	dispatchInternalServerError: function(error) {
		this.dispatchError(new errors.InternalError(error));
	},

	dispatchNotFoundError: function(error) {
		this.dispatchError(new errors.NotFoundError(error));
	},

	dispatchSuccessfulResourceCreation: function(resourceIdentifier) {
		this.response.setHeader('Location', 'http://algo/' + resourceIdentifier);
        this.response.status(201).send(null);
	}
});

// assigning the extend function to every resource class in the base library
Resource.extend = extend;

// module exports
module.exports.Resource = Resource;
module.exports.errors = errors;
