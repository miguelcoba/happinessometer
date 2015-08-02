'use strict';

module.exports = {
    app: {
        pendingUser: {
            validUntilDays: 1
        }
    },
    db: {
        uri: 'mongodb://happinessometer:nearsoft1234@ds043350.mongolab.com:43350/heroku_3ljh15n9',
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
