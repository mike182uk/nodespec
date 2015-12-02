/**
 * Module dependencies
 */

var baseCommand = require('./command');
var clc = require('cli-color');
var file = require('./file');
var mustache = require('mustache');
var path = require('path');

/**
 * Module export
 */

module.exports = application;

/**
 * Constants
 */

var APP_NAME = 'Nodespec';
var CONFIG_FILENAME = 'nodespec.json';

/**
 * Main application
 *
 * @param  {String} version
 * @param  {String} templatesPath
 * @param  {Object} config
 * @return {Object}
 */

function application(version, templatesPath, config) {
  var program = require('commander');

  program.version(version);

  return {

    /**
     * Get the program
     *
     * @return {Object}
     */

    getProgram: function() {
      return program;
    },

    /**
     * Run the application
     */

    run: function() {
      program.parse(process.argv);

      if (!process.argv.slice(2).length) {
        program.outputHelp();
      }
    },

    /**
     * Add a command to the application
     *
     * @param {String} cmd
     */

    addCommand: function(command) {
      if (baseCommand.isPrototypeOf(command)) {
        command.register(this);
      }
    },

    /**
     * Get the config for the application
     */

    getConfig: function() {
      return config;
    },

    /**
     * Get the path to a template
     *
     * @param  {String} template
     * @return {String}
     */

    getTemplatePath: function(template) {
      return path.join(templatesPath, template);
    },

    /**
     * Get a compiled template
     *
     * @param  {String} template
     * @param  {Array} vars
     * @return {String}
     */

    getTemplate: function(template, vars) {
      vars = vars || {};

      var path = this.getTemplatePath(template);
      var template = file(path).read();

      return mustache.render(template, vars);
    },

    /**
     * Output an error message to the console
     *
     * @param {String} message
     */

    error: function(message) {
      console.log(clc.red(message));
    },

    /**
     * Output a success message to the console
     *
     * @param {String} message
     */

    success: function(message) {
      console.log(clc.green(message));
    },

    /**
     * Output an info message to the console
     *
     * @param {String} message
     */

    info: function(message) {
      console.log(clc.blue(message));
    },
  }
}

/**
 * Get the name of the application
 *
 * @return {String}
 */

application.getName = function() {
  return APP_NAME;
}

/**
 * Get the filename for the application config
 *
 * @return {String}
 */

application.getConfigFilename = function() {
  return CONFIG_FILENAME;
}
