#!/usr/bin/env node

var file = require('./src/file');
var application = require('./src/application');
var path = require('path');
var pkg = require('./package.json');

/**
 * Initialize application
 */

var templatesPath = path.join(__dirname, 'resource', 'template');
var configPath = path.join(process.cwd(), application.getConfigFilename());
var config = file(configPath).exists() ? require(configPath) : {};

var app = application(pkg.version, templatesPath, config);

/**
 * Add commands to application
 */

[
  require('./src/command/init'),
  require('./src/command/describe'),
  require('./src/command/run'),
].forEach(function(command) {
  app.addCommand(command);
});

/**
 * Run application
 */

app.run();
