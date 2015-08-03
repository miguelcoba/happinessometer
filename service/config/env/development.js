'use strict';

module.exports = {
    app: {
        pendingUser: {
            validUntilDays: 1
        }
    },
    db: {
        uri: 'mongodb://happinessometer:nearsoft1234@ds047602.mongolab.com:47602/heroku_723b2rt0',
        options: {
            user: '',
            pass: '',
            server: {
                socketOptions: {
                    keepAlive: true
                }
            }
        }
    },
    secretKey: "{;|XQu]]o!>bq6B>KGHW?wl7#KJ,i%(DB'l]'yrZB=:|3g}?:2S%BqfnF6b",
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            //stream: 'access.log'
        }
    }
};
