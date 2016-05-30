var express= require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var CodeRunner = require('./lib/codeRunner');

var codeRunner = new CodeRunner();

// the coderunner can emit events which we then broadcast
// to the web client.
codeRunner.on('consoledata', function(data){
    io.sockets.emit('consoledata', data);
});

app.use(express.static('static'));

io.on('connection', function(socket) {

  socket.on('code', function(code){
    codeRunner.run( code );
  });

  socket.on('stop', function(){
    codeRunner.stop();
  });

  socket.on('control', function(control){
    codeRunner.controlEvent( control[0], control[1] );
  });

});

http.listen(3000, function() {
  console.log('Listening on http://localhost:3000')
});
