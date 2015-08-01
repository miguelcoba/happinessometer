'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    userSchema;

userSchema = new Schema({ 
    username: {
        type: String,
        required: true,
        unique : true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
    },
    // TODO createdAt should be UTC
    createdAt: {
        type: Date,
        default: moment().utc()
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = doc._id;
            delete ret._id;
            return ret;
        }
    }
});

userSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

userSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

userSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/*
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
*/

// TODO roles by user
module.exports = mongoose.model('User', userSchema);