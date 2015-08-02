/**
 * Module dependencies
 */

var _ = require('lodash');
var command = require('../command');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var specification = require('../specification');

/**
 * Module export
 */

var descCommand = Object.create(command);

descCommand.register = register;

module.exports = descCommand;

/**
 * Constants
 */

var SPEC_TEMPLATE = 'spec.js';

/**
 * Register the command with the application
 *
 * @param {Object} app
 */

function register(app) {
  app
    .getProgram()
    .command('describe <Object>')
    .alias('desc')
    .description('Describe an object')
    .action(describe.bind(this, app));
}

/**
 * Describe command
 *
 * @param {Object} app
 * @param {String} object
 */

function describe(app, object) {
  // Strip off any extraneous slashes
  object = _.trim(object, '/');

  // Check the object is valid
  if (!/^([A-Za-z0-9][\/]?)*$/.test(object)) {
    return app.error(object + ' is an invalid object name');
  }

  var config = app.getConfig();
  var spec = specification(object, config.specPath, config.specSuffix);
  var specDir = spec.getAbsoluteDirectory();

  // Create the directories for the spec if they do not exist
  if (!fs.existsSync(specDir)) {
    mkdirp.sync(specDir);
  }

  // Create the spec if it does not exist
  var specPathAbsolute = spec.getAbsolutePath();

  if (!fs.existsSync(specPathAbsolute)) {
    var depth = spec.getRelativePath()
                  .match(/\//g)
                  .length;

    var srcPathRelative = path.join(
      _.repeat('../', depth),
      config.srcPath,
      spec.getPrefixedObjectName() + '.js'
    );

    var template = app.getTemplate(SPEC_TEMPLATE, {
      object: spec.getObjectName(),
      srcPathRelative: srcPathRelative,
    });

    fs.writeFileSync(specPathAbsolute, template);

    app.success('Spec for ' + object + ' created at ' + specPathAbsolute);
  } else {
    app.info('Spec for ' + object + ' already exists');
  }
}
