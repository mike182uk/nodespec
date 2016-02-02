/**
 * Module dependencies
 */

var _ = require('lodash');
var command = require('../command');
var file = require('../file');
var glob = require('glob');
var inquirer = require('inquirer');
var path = require('path');
var spawn = require('child_process').spawn;
var specification = require('../specification');

/**
 * Module export
 */

var runCommand = Object.create(command);

runCommand.register = register;

module.exports = runCommand;

/**
 * Constants
 */

const OBJECT_TEMPLATE = 'object.js';
const RUNNER_CONFIG_FILE = 'support/jasmine.json';
const RUNNER_BIN = __dirname + '/../../node_modules/.bin/jasmine';

/**
 * Register the command with the application
 *
 * @param {Object} app
 */

function register(app) {
  app
    .getProgram()
    .command('run [spec]')
    .description('Run all of the specs or an individual spec')
    .action(run.bind(this, app));
}

/**
 * Run command
 *
 * @param {Object} app
 * @param {String} spec
 */

function run(app, spec) {
  var config = app.getConfig();

  // Make sure the runner is initialized before we run anything
  initRunnerConfig(app);

  if (!spec) {
    return runAllSpecs(app);
  }

  // If spec arg does not contain .js we will assume this is actually
  // the name of the object rather than a path to the spec itself
  if (spec.indexOf('.js') === -1) {
    spec = specification(spec, config.specPath, config.specSuffix);
  } else {
    spec = specification.fromPath(spec, config.specPath, config.specSuffix);
  }

  if (!file(spec.getAbsolutePath()).exists()) {
    return app.error('Spec not found at ' + spec.getAbsolutePath());
  }

  runSingleSpec(spec, config.srcPath, app);
}

/**
 * Run all specs
 *
 * @param {Object} app
 */

function runAllSpecs(app) {
  var config = app.getConfig();
  var specsPath = path.join(process.cwd(), config.specPath);
  var srcPath = path.join(process.cwd(), config.srcPath);
  var specs = glob.sync(specsPath + '/**/*' + config.specSuffix + '.js');

  // Loop through each spec and see if a corresponding src file exists. If it
  // does not, ask the user if they want to create it
  var srcFileObjectHash = {};

  _.each(specs, function(spec) {
    spec = specification.fromPath(spec, config.specPath, config.specSuffix);

    var object = spec.getPrefixedObjectName();
    var srcAbosultePath = path.join(srcPath, object + '.js');

    if (!file(srcAbosultePath).exists()) {
      srcFileObjectHash[object] = srcAbosultePath;
    }
  });

  if (Object.keys(srcFileObjectHash).length) {
    return promptSrcFilesCreation(srcFileObjectHash, app);
  }

  runRunner();
}

/**
 * Run a single spec
 *
 * @param {Object} spec
 * @param {String} srcPath
 * @param {Object} app
 */

function runSingleSpec(spec, srcPath, app) {
  var object = spec.getPrefixedObjectName();
  var srcAbosultePath = path.join(process.cwd(), srcPath, object + '.js');

  // If the src file for the spec does not exist, ask the
  // user if they want to create it
  if (!file(srcAbosultePath).exists()) {
    var srcFileObjectHash = {};

    srcFileObjectHash[object] = srcAbosultePath;

    return promptSrcFilesCreation(srcFileObjectHash, app);
  }

  runRunner(spec.getRelativePath());
}

/**
 * Ask they user if they want the src files to be created
 *
 * @param {Object} srcFileObjectMap
 * @param {Object} app
 */

function promptSrcFilesCreation(srcFileObjectMap, app) {
  var questions = [];

  _.each(srcFileObjectMap, function(srcFilePath, object) {
    questions.push(createQuestion(object));
  });

  inquirer.prompt(questions, function(answers) {
    _.each(answers, function(answer, object) {
      if (answer === 'y') {
        var srcFilePath = srcFileObjectMap[object];

        var template = app.getTemplate(OBJECT_TEMPLATE, {
          object: object,
        });

        file(srcFilePath).create(template);

        app.success(object + ' created at ' + srcFilePath);
      }

      // Run the runner once all of the answers have been processed
      delete srcFileObjectMap[object];

      if (!Object.keys(srcFileObjectMap).length) {
        runRunner();
      }
    });
  });
}

/**
 * Create question to ask the user
 *
 * @param {String} object
 */

function createQuestion(object) {
  return {
    type: 'input',
    name: object,
    message: object + ' does not exist. Shall i create it for you?',
    default: 'y',
    validate: function(value) {
      return value.match(/^(y|n)$/) ? true : 'Please answer y or n';
    },
  }
}

/**
 * Initialize the runner config if it has not already been initialized
 *
 * @param {Object} app
 */

function initRunnerConfig(app) {
  var config = app.getConfig();
  var runnerConfigFilePath = path.join(
    process.cwd(),
    config.specPath,
    RUNNER_CONFIG_FILE
  );
  var runnerConfigFile = file(runnerConfigFilePath);

  if (!runnerConfigFile.exists()) {
    var data = JSON.stringify(config.runner, null, 2);

    runnerConfigFile.create(data);
  }
}

/**
 * Run the runner for a given spec or all the specs
 * if `specRelativePath` is omitted
 *
 * @param {String}
 */

function runRunner(specRelativePath) {
  var args = [];

  if (specRelativePath) {
    args.push(specRelativePath);
  }

  spawn(RUNNER_BIN, args, {
    stdio: 'inherit',
  });
}
