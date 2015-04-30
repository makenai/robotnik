'use strict';

function commands($http) {
  return {
    send: send
  };

  function send(channel, message) {
    $http({
      method: 'POST',
      url: '/message',
      data: $.param({channel, message}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  }
}

export default commands;