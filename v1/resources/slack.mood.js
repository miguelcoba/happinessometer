'use strict';

var base = require('../lib/base'),
    validate = require('validate.js'),
    moodsEnum = require('../../app/models/mood_enum'),
    moodService = require('../../app/services/mood.service')();

module.exports = base.Resource.extend({
    needsToken: [],

    post: function() {
        var self = this;

        console.log('Request: ', self.request.body);

        var errors = validate(self.request.body, { 
            token: {
                presence: true
            },
            user_name: {
                presence: true
            },
            command: {
                presence: true
            },
            text: {
                presence: true
            }
        });

        if (errors) {
            return self.dispatchValidationErrors("There are errors", errors);
        } else if (moodsEnum.indexOf(self.request.body.text) < 0) {
            return self.response.send("Sorry, I don't know that feeling");
        }

        if (self.request.body.token !== 't96I6qnMO5hTXkEBzR7Gxi9I') {
            return self.dispatchValidationErrors("Invalid slack token");
        }

        // TODO if user is present, validate the existence of that user within the company

        moodService.setMood({
            user: self.request.body.user_name + '@nearsoft.com',
            mood: self.request.body.text,
            comment: 'I feel : ' + self.request.body.text
        }, function(err, newMood) {
            var responseText;

            if (err) {
                return self.handleError(err);
            }

            switch(newMood.mood) {
                case 'love':
                    responseText = "Glad you feel " + newMood.mood + " I'd like to feel that way too! :heart_eyes:";
                    break;
                case 'joy':
                    responseText = ":rabbit: Glad you feel " + newMood.mood;
                    break;
                case 'normal':
                    responseText = "Normal, that's boring. You need some fun things in your life. What about this :dancer:";
                    break;
                case 'surprise':
                    responseText = "So someone surpised you like this :scream:, or like this :astonished:"
                    break;
                case 'sadness':
                case 'fear':
                case 'disgust':
                    responseText = "I now know you feel " + newMood.mood + ". Do you need to talk with someone? I could hear you!"
                    break;
                case 'anger':
                    responseText = "Oh... If you feel " + newMood.mood + " I know someone that knowns someone.., just in case :smiling_imp:" 
                    break;
            }

            return self.response.send(responseText);
        });
    }
});
