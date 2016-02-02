module.exports = function() {
  this.World = require('../support/world').World;

  this.Given(/^I have initialized Nodespec$/, function () {
    this.exec('nodespec init');
  });
}
