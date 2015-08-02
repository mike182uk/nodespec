var specification = require('../../src/specification');

var APP_CONFIG_FILE_NAME = require('../../src/application').getConfigFilename();

var execOutput, specContent;

module.exports = function() {
  this.When(/^I describe the object "([^"]*)"$/, function (object, callback) {
    execOutput = this.exec('nodespec describe ' + object);

    callback();
  });

  this.Then(/^I should see that a spec was created for "([^"]*)"$/, function (object, callback) {
    if (!(new RegExp('Spec for ' + object + ' created')).test(execOutput)) {
      callback.fail(new Error('Expected to see that the spec was created for ' + object));
    }

    callback();
  });

  this.Then(/^the spec for "([^"]*)" should be present in the project$/, function (object, callback) {
    var config = JSON.parse(this.readFile(APP_CONFIG_FILE_NAME));
    var spec = specification(object, config.specPath, config.specSuffix);
    var specPath = spec.getRelativePath();

    if (!this.fileExists(specPath)) {
      callback.fail(new Error('Expected spec for ' + object + ' to be present in the project'));
    }

    callback();
  });

  this.When(/^I describe the object "([^"]*)" using the describe command alias$/, function (object, callback) {
    execOutput = this.exec('nodespec desc ' + object);

    callback();
  });

  this.Given(/^I have already described the object "([^"]*)"$/, function (object, callback) {
    var config = JSON.parse(this.readFile(APP_CONFIG_FILE_NAME));
    var spec = specification(object, config.specPath, config.specSuffix);

    this.exec('nodespec describe ' + object);

    specContents = this.readFile(spec.getRelativePath());

    callback();
  });

  this.Then(/^I should see that a spec for "([^"]*)" already exists$/, function (object, callback) {
    if (!(new RegExp('Spec for ' + object + ' already exists')).test(execOutput)) {
      callback.fail(new Error('Expected to see that the spec for ' + object + ' already exists'));
    }

    callback();
  });

  this.Then(/^the existing spec for "([^"]*)" should be unaltered$/, function (object, callback) {
    var config = JSON.parse(this.readFile(APP_CONFIG_FILE_NAME));
    var spec = specification(object, config.specPath, config.specSuffix);

    if (!this.readFile(spec.getRelativePath()) == specContents) {
      callback.fail(new Error('Expected spec for ' + object + ' to be unaltered'));
    }

    callback();
  });

  this.Then(/^I should see that the object name is invalid$/, function (callback) {
    if (!/invalid object name/.test(execOutput)) {
      callback.fail(new Error('Expected to see that the object name is invalid'));
    }

    callback();
  });
}
