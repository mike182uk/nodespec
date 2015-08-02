/**
 * Module dependencies
 */

var path = require('path');

/**
 * Module export
 */

module.exports = specification;

/**
 * Specification
 *
 * @param  {String} object
 * @param  {String} specPath
 * @param  {String} specSuffix
 * @return {Object}
 */

function specification(object, specPath, specSuffix) {
  return {

    /**
     * Get the name of the object that this specification is for
     *
     * @return {String}
     */

    getObjectName: function() {
      if (object.indexOf('/') !== -1) {
        return object.slice(object.lastIndexOf('/') + 1);
      }

      return object;
    },

    /**
     * Get prefix for the object name
     *
     * @return {String}
     */

    getObjectNamePrefix: function() {
      var prefix = '';

      if (object.indexOf('/') !== -1) {
        prefix = object.slice(0, object.lastIndexOf('/') + 1);
      }

      return prefix;
    },

    /**
     * Get the name of the object with its prefix
     *
     * @return {String}
     */

    getPrefixedObjectName: function() {
      return this.getObjectNamePrefix() + this.getObjectName();
    },

    /**
     * Get the specification name
     *
     * @return {String}
     */

    getName: function() {
      return this.getObjectName() + specSuffix;
    },

    /**
     * Get the specification filename
     *
     * @return {String}
     */

    getFilename: function() {
      return this.getName() + '.js';
    },

    /**
     * Get the specification's relative path
     *
     * @return {String}
     */

    getRelativePath: function() {
      return path.join(
        specPath,
        this.getObjectNamePrefix() + this.getFilename()
      );
    },

    /**
     * Get the specification's absolute path
     *
     * @return {String}
     */

    getAbsolutePath: function() {
      return path.join(process.cwd(), this.getRelativePath());
    },

    /**
     * Get the specification's directory absolute path
     *
     * @return {String}
     */

    getAbsoluteDirectory: function() {
      return this.getAbsolutePath()
              .replace('/' + this.getFilename(), '');
    },
  }
}

/**
 * Create a specification from a path
 *
 * @param {Stirng} path
 * @param {String} specPath
 * @param {String} specSuffix
 */

specification.fromPath = function(path, specPath, specSuffix) {
  var object = path
                .replace(process.cwd() + '/', '')
                .replace(specPath + '/', '')
                .replace(specSuffix + '.js', '');

  return this.apply(this, [object, specPath, specSuffix]);
}
