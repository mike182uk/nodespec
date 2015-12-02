/**
 * Module dependencies
 */

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Module export
 */

module.exports = file;

/**
 * File
 *
 * @param  {String} filePath
 * @return {Object}
 */

function file(filePath) {
  var pathinfo = path.parse(filePath);

  return {
    /**
     * Check if the file exists
     *
     * @return {Boolean}
     */

    exists: function() {
      return fs.existsSync(filePath);
    },

    /**
     * Create the file and append content if supplied
     *
     * @param {String} content
     */
    create: function(content) {
      content = content || '';

      if (pathinfo.dir) {
        mkdirp.sync(pathinfo.dir);
      }

      fs.writeFileSync(filePath, content);
    },

    /**
     * Get the contents of a file
     *
     * @return {String}
     */
    read: function() {
      return fs.readFileSync(filePath).toString();
    },
  }
}
