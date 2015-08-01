'use strict';
var mongoose = require('mongoose');
var crypto = require('crypto');


var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		index: true
	},

	password: {
		type: String,
		required: true
	},

	name: {
		type: String
	},

	confirmed: {
		type: Boolean,
		required: true,
		default: false
	},

	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
}, {
	toJSON: {
		transform: function(doc, ret) {
			ret.id = doc._id;
			delete ret._id;
		}
	}
});

UserSchema.methods = {
	hashPassword: function(continuation) {
		var hash = crypto.createHash('sha1');
		this.password = hash.update(this.password).digest('hex');
		return continuation(null, this.password);
	},

	verifyPassword: function(password, continuation) {
		var hash = crypto.createHash('sha1');
		var digest = hash.update(password).digest('hex');
		return continuation(null, this.password == digest);
	}
};


module.exports = mongoose.model('User', UserSchema);
