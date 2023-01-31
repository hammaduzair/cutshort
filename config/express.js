const express = require('express');
const session = require('express-session');
const moduleAlias = require('module-alias');
const configUtils = require('./util');
const path = require('path');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 10, // Limit each IP to 10 requests per minute
	standardHeaders: true, 
	legacyHeaders: false,
})

moduleAlias.addAliases({
	'@core': `${__dirname}/../core`,
	'@config': `${__dirname}/../config`,
    '@helpers': `${__dirname}/../helpers`,
});

module.exports = function (db) {
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }));
    app.use(limiter)
    configUtils.getGlobbedFiles(['./models/**/*.js', './*/models/*.js']).forEach(function (modelPath) {
		require(path.resolve(modelPath));
	});
    app.use(session({ secret: 'SECRET' }))
    return app;
};