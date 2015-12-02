/**
 * Module dependencies
 */

var _ = require('lodash');
var command = require('../command');
var file = require('../file');
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
  var specPathAbsolute = spec.getAbsolutePath();
  var specFile = file(specPathAbsolute);

  if (!specFile.exists()) {
    specFile.create(getSpecFileContents(spec, app));

    app.success('Spec for ' + object + ' created at ' + specPathAbsolute);
  } else {
    app.info('Spec for ' + object + ' already exists');
  }
}

/**
 * Get the parsed contents for the spec file
 *
 * @param {Object} spec
 * @param {Object} app
 * @return {String}
 */

function getSpecFileContents(spec, app) {
  var config = app.getConfig();

  return app.getTemplate(SPEC_TEMPLATE, {
    object: spec.getObjectName(),
    srcPathRelative: getSrcPathRelative(spec, config.srcPath),
  });
}

/**
 * Get the relative path to the associated src file
 *
 * @param {Object} spec
 * @param {Object} app
 * @return {String}
 */

function getSrcPathRelative(spec, srcPath) {
  var depth = spec.getRelativePath()
    .match(/\//g)
    .length;

  return path.join(
    _.repeat('../', depth),
    srcPath,
    spec.getPrefixedObjectName() + '.js'
  );
}
