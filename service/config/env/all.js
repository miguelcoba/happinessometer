'use strict';

module.exports = {
    app: {
        title: 'Happinessometer - Service',
        description: 'Happinessometer Service',
        keywords: 'happinessometer, service',
        pendingUser: {
            validUntilDays: 3
        }
    },
    port: process.env.PORT || 3000,
    sessionName: 'connect.sid',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'combined',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            stream: 'access.log'
        }
    }
};
