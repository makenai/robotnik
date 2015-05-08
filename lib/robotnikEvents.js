/**
 * Register events coming in over IPC from the robotnik process.
 */

var ipc = require('ipc');
var CodeRunner = require('./codeRunner');

var codeRunner = new CodeRunner();

// Execute generated code
ipc.on('code', function(event, code) {
  codeRunner.run( code );
});

// Stop code execution
ipc.on('stop', function(event) {
  codeRunner.stop();
});

// Control events
ipc.on('control', function(event, control) {
  codeRunner.controlEvent( control[0], control[1] );
});
