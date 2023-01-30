const express = require('express');
const session = require('express-session');
const config = require('../config');
const configUtils = require('./util');
const path = require('path');

module.exports = function (db) {
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }));
    configUtils.getGlobbedFiles(['./models/**/*.js', './*/models/*.js']).forEach(function (modelPath) {
		require(path.resolve(modelPath));
	});
    app.use(session({ secret: 'SECRET' }))
    return app;
};