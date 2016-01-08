var APP_CONFIG_FILE_NAME = require('../../src/application').getConfigFilename();

var execOutput, specContent;

module.exports = function() {
  this.World = require('../support/world').World;

  this.Given(/^I have initialized Nodespec$/, function () {
    this.exec('nodespec init');
  });
}
