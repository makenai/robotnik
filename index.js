#!/usr/bin/env node

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs')
  , childProcess = require("child_process")

app.use(express.static(__dirname + '/static'))

server.listen(8057)
console.log('Please connect to http://localhost:8057/')


var CodeRunner = {

  // Run the specified code
  run: function( code, handleError ) {
    var filename = __dirname + '/robotnik-file.js',
      codeRunner = this
    fs.writeFile( filename, code, function(err) {
      if (!err) {
        codeRunner.child = childProcess.fork( filename )
        codeRunner.child.on('exit', function(code, signal) {
          // 8 = horrible error
          if ( code == 8 )
            handleError()
        })
      }
    })
  },

  // Kill the process
  kill: function() {
    if ( this.child )
      this.child.kill()
  },

  // Send a message
  send: function(message) {
    if ( this.child )
      this.child.send(message)
  }

}

io.sockets.on('connection', function (socket) {

  socket.on('code', function(code) {
    CodeRunner.run( code, function() {
      socket.emit('error', 'Program closed unexpectedly')
    })
  });

  socket.on('control', function (control) {
    CodeRunner.send( control );
    if ( control == 'stop' ) {
      CodeRunner.kill()
    }
  })

})