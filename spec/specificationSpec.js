var path = require('path');
var specification = require('../src/specification');

describe('specification for object', function() {
  var objectName = 'foo';
  var specPath = 'spec';
  var specSuffix = 'Spec';

  var spec = specification(objectName, specPath, specSuffix);

  it('should return the name of the object that the spec is for', function() {
    expect(spec.getObjectName()).toBe(objectName);
  });

  it('should return the name of the spec', function() {
    expect(spec.getName()).toBe(objectName + specSuffix);
  });

  it('should return the filename of the spec', function() {
    expect(spec.getFilename()).toBe(objectName + specSuffix + '.js');
  });

  it('should return the relative path for the spec', function() {
    expect(spec.getRelativePath()).toBe(path.join(specPath, objectName + specSuffix + '.js'));
  });

  it('should return the absolute path for the spec', function() {
    expect(spec.getAbsolutePath()).toBe(path.join(process.cwd(), specPath, objectName + specSuffix + '.js'));
  });

  it('should return the absolute path for the directory the spec will be in', function() {
    expect(spec.getAbsoluteDirectory()).toBe(path.join(process.cwd(), specPath));
  });
});

describe('specification for object with prefix', function() {
  var objectNamePrefixed = 'foo/bar/baz';
  var objectName = 'baz';
  var objectPrefix = 'foo/bar/';
  var specPath = 'spec';
  var specSuffix = 'Spec';

  var spec = specification(objectNamePrefixed, specPath, specSuffix);

  it('should return the name of the object that the spec is for', function() {
    expect(spec.getObjectName()).toBe(objectName);
  });

  it('should return the prefix for the object that the spec is for', function() {
    expect(spec.getObjectNamePrefix()).toBe(objectPrefix);
  });

  it('should return the name and prefix of the object that the spec is for', function() {
    expect(spec.getPrefixedObjectName()).toBe(objectPrefix + objectName);
  });

  it('should return the name of the spec', function() {
    expect(spec.getName()).toBe(objectName + specSuffix);
  });

  it('should return the filename of the spec', function() {
    expect(spec.getFilename()).toBe(objectName + specSuffix + '.js');
  });

  it('should return the relative path for the spec', function() {
    expect(spec.getRelativePath()).toBe(path.join(specPath, objectPrefix + objectName + specSuffix + '.js'));
  });

  it('should return the absolute path for the spec', function() {
    expect(spec.getAbsolutePath()).toBe(path.join(process.cwd(), specPath, objectPrefix + objectName + specSuffix + '.js'));
  });

  it('should return the absolute path for the directory the spec will be in', function() {
    expect(spec.getAbsoluteDirectory()).toBe(path.join(process.cwd(), specPath, objectPrefix.substring(0, objectPrefix.length - 1)));
  });
});

describe('specification static methods', function() {
  var objectName = 'foo';
  var specPath = 'spec';
  var specSuffix = 'Spec';
  var objectSpecRelativePath = path.join(specPath, objectName + specSuffix + '.js');
  var objectSpecAbsolutePath = path.join(process.cwd(), objectSpecRelativePath);

  it('should create a specification from a relative path', function() {
    var spec = specification.fromPath(objectSpecRelativePath, specPath, specSuffix);

    expect(spec.getObjectName()).toBe(objectName);
    expect(spec.getName()).toBe(objectName + specSuffix);
    expect(spec.getFilename()).toBe(objectName + specSuffix + '.js');
  });

  it('should create a specification from an absolute path', function() {
    var spec = specification.fromPath(objectSpecAbsolutePath, specPath, specSuffix);

    expect(spec.getObjectName()).toBe(objectName);
    expect(spec.getName()).toBe(objectName + specSuffix);
    expect(spec.getFilename()).toBe(objectName + specSuffix + '.js');
  });
});
