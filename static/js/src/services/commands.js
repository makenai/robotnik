'use strict';

function commands($http) {

  return {
    send: send
  };

  function send(channel, message) {
    if ( typeof(ipc) !== 'undefined' ) {
      ipc.send( channel, message );
    } else {
      socket.emit( channel, message );
    }
  }
}

export default commands;
