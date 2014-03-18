#!/usr/bin/env node

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , fs = require('fs')
  , childProcess = require("child_process")

app.use(express.static(__dirname + '/static'))
app.use(express.urlencoded())

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
  },

  is_alive: function() {

  }

}

app.post('/message', function(req,res) {
  var message = req.body.message,
    channel = req.body.channel

  console.log( '/' + channel + '/ ' + message )

  if ( channel == 'code' ) {
    CodeRunner.run( message, function() {
      res.send('Program closed unexpectedly')
    })    
  }

  if ( channel == 'control' ) {
    CodeRunner.send( message );
    if ( message == 'stop' ) {
      CodeRunner.kill()
    }
  }
  res.send('OK');
})