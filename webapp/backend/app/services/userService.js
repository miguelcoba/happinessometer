var User = require('../models/user');

UserService = function() {
};

/**
 * Create a new user into the application
 *
 * @param {newUser}
 * @param {adminUser}
 */
UserService.prototype.createNewUser = function(newUserConfig, adminUsername) {
    this._validateUsername(adminUsername, function(err, adminUser) {
        if (err) {
            console.log('error');
        }

        var newUser = new User({
            username: newUserConfig.username,
            password: newUserConfig.password,
            name: { first: newUserConfig.firstName, last: newUserConfig.lastName },
            email: newUserConfig.email,
            createdBy: adminUser.username,
            enabled: true
        });

        // TODO save user, generate UUID to handle registration by the created user
    });
};

UserService.prototype._validateUsername = function(username, callback) {
    var query = User.findOne({ 'username': username });
    query.select('username');
    query.exec(callback):
}:

module.exports = function() {
    return new UserService();
}