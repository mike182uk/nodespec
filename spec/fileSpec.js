var rewire = require('rewire');
var sinon = require('sinon');

var file = rewire('../src/file');

describe('file', function() {
  it('should check if a file exists', function() {
    var filename = 'foo';
    var fsExsistsSyncStub = sinon.stub().withArgs(filename).returns(true);

    file.__set__('fs', {
      existsSync: fsExsistsSyncStub
    });

    expect(file(filename).exists()).toBe(true);
    expect(fsExsistsSyncStub.calledWith(filename)).toBe(true);
  });

  it('should create a file with content', function() {
    var fsWriteFileSyncStub = sinon.stub();
    var filename = 'foo';
    var content = 'foo';

    file.__set__('fs', {
      writeFileSync: fsWriteFileSyncStub
    });

    file(filename).create(content);

    expect(fsWriteFileSyncStub.calledWith(filename, content)).toBe(true);
  });

  it('should create a file with no content', function() {
    var fsWriteFileSyncStub = sinon.stub();
    var filename = 'foo';

    file.__set__('fs', {
      writeFileSync: fsWriteFileSyncStub
    });

    file(filename).create();

    expect(fsWriteFileSyncStub.calledWith(filename, '')).toBe(true);
  });

  it('should create any directories needed for the file', function() {
    var mkdirpSyncStub = sinon.stub();
    var filename = 'foo/bar/baz';

    file.__set__('mkdirp', {
      sync: mkdirpSyncStub
    });

    file(filename).create();

    expect(mkdirpSyncStub.calledWith('foo/bar')).toBe(true);
  });

  it('should get the contents of a file', function() {
    var filename = 'foo';
    var content = 'bar';
    var readFileSyncStub = sinon.stub().withArgs(filename).returns(content);

    file.__set__('fs', {
      readFileSync: readFileSyncStub
    });

    expect(file(filename).read()).toBe(content);
    expect(readFileSyncStub.calledWith(filename)).toBe(true);
  });
});
