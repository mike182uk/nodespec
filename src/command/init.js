/**
 * Module dependencies
 */

var application = require('../application');
var command = require('../command');
var file = require('../file');
var path = require('path');

/**
 * Module export
 */

var initCommand = Object.create(command);

initCommand.register = register;

module.exports = initCommand;

/**
 * Constants
 */

var CONFIG_TEMPLATE = 'config.json';

/**
 * Register the command with the application
 *
 * @param {Object} app
 */

function register(app) {
  app
    .getProgram()
    .command('init')
    .description('Initialize ' + application.getName())
    .action(init.bind(this, app));
}

/**
 * Init command
 *
 * @param {Object} app
 */

function init(app) {
  var configPath = path.join(process.cwd(), application.getConfigFilename());
  var config = app.getConfig();

  if (!Object.keys(config).length) {
    var configTemplate = file(
      app.getTemplatePath(CONFIG_TEMPLATE)
    ).read();

    file(configPath).create(configTemplate);

    app.success(application.getName() + ' config created at ' + configPath);
  } else {
    app.info(application.getName() + ' config already exists');
  }
}
