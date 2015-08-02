var fs = require('fs');
var rimraf = require('rimraf');

module.exports = function() {
  // Create a temp project directory before each scenario
  this.Before(function(callback) {
    fs.mkdirSync(this.projectPath);

    // Once we have created the path make sure we follow any symlinks
    // The temp path will be created at /var but this is a symlink to
    // /private/var
    this.projectPath = fs.realpathSync(this.projectPath);

    callback();
  });

  // Remove the temporary project directory after each scenario
  this.After(function(callback) {
    rimraf.sync(this.projectPath);

    callback();
  });
}
