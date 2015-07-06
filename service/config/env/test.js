'use strict';

module.exports = {
    app: {
        pendingUser: {
            validUntilDays: 1
        }
    },
    db: {
        uri: 'mongodb://localhost/happinessometer-test',
        options: {
            user: '',
            pass: '',
            server: {
                socketOptions: {
                    keepAlive: false,
                    poolSize: 1
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
