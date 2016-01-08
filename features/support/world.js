var childPty = require('child_pty');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var temp = require('temp');

module.exports.World = function(callback) {
  // Temporary project path
  this.projectPath = temp.path({ prefix: 'nodespec-' });

  // Execute a command from within in the project path and return its output
  this.exec = function(command) {
    return exec(command, {
      cwd: this.projectPath,
      encoding: 'utf-8'
    });
  }

  // Execute an interactive command from within in the project path and return its output.
  // Interactive commands (commands that take input) need to use a PTY, which
  // child_process.exec does not provide for us, so we use the child_pty module for this.
  // child_pty only provides async methods so we need to wrap this in a promise so that
  // it can be utilized correctly by cucumber
  this.execInteractive = function(command, input) {
    var projectPath = this.projectPath;
    var args = command.split(' ');
    var command = args.shift();

    return new Promise(function(resolve, reject) {
      var childProcess = childPty.spawn(command, args, {
        cwd: projectPath
      });
      var output = '';

      childProcess.stdout.on('data', function(chunk) {
        output += chunk;
      });

      childProcess.stdin.write(input);

      childProcess.on('exit', function() {
        resolve(output);
      });
    });
  }

  // Check a file exists in the project path
  this.fileExists = function(file) {
    return fs.existsSync(path.join(this.projectPath, file));
  }

  // Read a file in the project path
  this.readFile = function(file) {
    return fs.readFileSync(path.join(this.projectPath, file), { encoding: 'utf-8'});
  }

  // Read a file that is not in the project path
  this.readNonProjectFile = function(file) {
    return fs.readFileSync(file, { encoding: 'utf-8'});
  }
}
