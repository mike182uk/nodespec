const APP_CONFIG_FILE_NAME = require('../../src/application').getConfigFilename();

var execOutput, configContents;

module.exports = function() {
  this.When(/^I execute the init command$/, function (callback) {
    execOutput = this.exec('nodespec init');

    callback();
  });

  this.Then(/^I should see that Nodespec was initialized$/, function (callback) {
    if (!/config created/.test(execOutput)) {
      callback.fail(new Error('Expected to see that Nodespec was initialized'));
    }

    callback();
  });

  this.Then(/^the Nodespec config file should be present in the project$/, function (callback) {
    if (!this.fileExists(APP_CONFIG_FILE_NAME)) {
      callback.fail(new Error('Expected "' + APP_CONFIG_FILE_NAME + '" to be present in the project'));
    }

    callback();
  });

  this.Then(/^the Nodespec config file contains the default Nodespec config$/, function (callback) {
    var configContents = this.readFile(APP_CONFIG_FILE_NAME);
    var defaultConfig = this.readNonProjectFile('resource/template/config.json');

    if (configContents !== defaultConfig) {
      callback.fail(new Error('Expected Nodespec config file to contain the default nodespec config'));
    }

    callback();
  });

  this.Given(/^I have already initialized Nodespec$/, function (callback) {
    execOutput = this.exec('nodespec init');
    configContents = this.readFile(APP_CONFIG_FILE_NAME);

    callback();
  });

  this.Then(/^I should see that Nodespec has already been initialized$/, function (callback) {
    if (!/config already exists/.test(execOutput)) {
      callback.fail(new Error('Expected to see that Nodespec is already initialized'));
    }

    callback();
  });

  this.Then(/^the existing Nodespec config should be unaltered$/, function (callback) {
    if (this.readFile(APP_CONFIG_FILE_NAME) !== configContents) {
      callback.fail(new Error('Expected the Nodespec config file to be unaltered'));
    }

    callback();
  });
}
