'use strict';

function commands($http) {

  return {
    send: send
  };

  function send(channel, message) {
    if ( typeof(ipc) !== 'undefined' ) {
      ipc.send( channel, message );
    } else {
      console.log('Support outside of electron is pending.');
    }
  }
}

export default commands;
