#! /usr/bin/env node

var fs = require('fs');
var application = require('./src/application');
var pkg = require('./package.json');

/**
 * Initialize application
 */

var templatesPath = __dirname + '/resource/template';
var configPath = process.cwd() + '/' + application.getConfigFilename();
var config = fs.existsSync(configPath) ? require(configPath) : {};

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
