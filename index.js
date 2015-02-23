'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var childProcess = require("child_process");

// Create static public directory
app.set('port', process.env.PORT || 8057);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded());

server.listen(app.get("port"), function () {
  console.log("Please connect to http://localhost:" + app.get("port"));
});

var CodeRunner = {

  // Run the specified code
  run: function( code, handleError ) {
    var filename = __dirname + '/robotnik-file.js';
    var codeRunner = this;
    fs.writeFile( filename, code, function(err) {
      if (!err) {
        codeRunner.child = childProcess.fork( filename );
        codeRunner.child.on('exit', function(code, signal) {
          // 8 = horrible error
          if ( code === 8 ) {
            handleError();
          }
        });
      }
    });
  },

  // Kill the process
  kill: function() {
    if ( this.child ) {
      this.child.kill();
    }
  },

  // Send a message
  send: function(message) {
    if ( this.child ) {
      this.child.send(message);
    }
  },

  is_alive: function() {

  }

};

app.post('/message', function(req,res) {
  var message = req.body.message,
    channel = req.body.channel;

  console.log( '/' + channel + '/ ' + message );

  if ( channel === 'code' ) {
    CodeRunner.run( message, function() {
      res.send('Program closed unexpectedly');
    });
  }

  if ( channel === 'control' ) {
    CodeRunner.send( message );
    if ( message === 'stop' ) {
      CodeRunner.kill();
    }
  }
  res.send('OK');
});
