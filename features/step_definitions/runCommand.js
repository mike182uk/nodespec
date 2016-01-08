var path = require('path');

var APP_CONFIG_FILE_NAME = require('../../src/application').getConfigFilename();

var execOutput;

module.exports = function() {
  this.When(/^I execute the run command and answer "([^"]*)" to the question$/, function (answer) {
    answer = answer + '\n'; // add a new line to register the input

    return this.execInteractive('nodespec run', answer) // returns promise
            .then(function(data) {
              execOutput = data;
            });
  });

  this.When(/^I execute the run command and answer "([^"]*)" to the questions$/, function (answers) {
    answers = answers.split(',').join('\n') + '\n';

    return this.execInteractive('nodespec run', answers) // returns promise
            .then(function(data) {
              execOutput = data;
            });
  });

  this.When(/^I execute the run command with the argument "([^"]*)" and answer "([^"]*)" to the question$/, function (argument, answer) {
    var config = JSON.parse(this.readFile(APP_CONFIG_FILE_NAME));

    answer = answer + '\n'; // add a new line to register the input

    argument = argument
                .replace('<absoluteSpecPath>', path.join(this.projectPath, config.specPath))
                .replace('<specPath>', config.specPath)
                .replace('<specSuffix>', config.specSuffix);

    return this.execInteractive('nodespec run ' + argument, answer) // returns promise
            .then(function(data) {
              execOutput = data;
            });
  });

  this.Then(/^I should see that the source file for "([^"]*)" was created$/, function (object, callback) {
    if (!(new RegExp(object + ' created at')).test(execOutput)) {
      callback.fail(new Error('Expected to see that the source file for ' + object + ' was created'));
    }

    callback();
  });

  this.Then(/^the source file for "([^"]*)" should be present in the project$/, function (object, callback) {
    var config = JSON.parse(this.readFile(APP_CONFIG_FILE_NAME));
    var objectPath = path.join(config.srcPath, object + '.js');

    if (!this.fileExists(objectPath)) {
      callback.fail(new Error('Expected source file for ' + object + ' to be present in the project'));
    }

    callback();
  });

  this.Then(/^the source file for "([^"]*)" should not be present in the project$/, function (object, callback) {
    var config = JSON.parse(this.readFile(APP_CONFIG_FILE_NAME));
    var objectPath = path.join(config.srcPath, object + '.js');

    if (this.fileExists(objectPath)) {
      callback.fail(new Error('Expected source file for ' + object + ' to not be present in the project'));
    }

    callback();
  });

  this.Then(/^I should see that the spec runner has run$/, function (callback) {
    if (!/([0-9]) (spec|specs), ([0-9]) failures/.test(execOutput)) {
      callback.fail(new Error('Expected to see that the spec runner has run'));
    }

    callback();
  });
}
