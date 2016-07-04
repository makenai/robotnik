import template from './running-controls.html';

var keycodeMap = {
  27: 'stop', // escape key
  38: 'up', // Arrow Up
  40: 'down', // Arrow Down
  37: 'left', // Arrow Left
  39: 'right', // Arrow Right
  87: 'up', // w
  65: 'left', // a
  83: 'down', // s
  68: 'right', // d
  82: 'red', // r
  71: 'green', // g
  13: 'red', // enter
  32: 'green' // space
}

export default function(commands) {
  return {
    template: template,
    controllerAs: 'vm',
    scope: {
      show: '=?'
    },
    controller: function($scope) {
      this.stop = stop($scope);
      this.redDown = createCommandHandler('red', 'down');
      this.redUp = createCommandHandler('red', 'up');
      this.greenDown = createCommandHandler('green', 'down');
      this.greenUp = createCommandHandler('green', 'up');
      this.joystickMove = buttonChanged;
      this.runningStatus = "Waiting for connection...";

      $scope.$watch('show', function(showModal) {
        $('#runningWindow').modal( showModal ? 'show' : 'hide' );
      });

      // deal with the console data coming in
      window.socket.on('consoledata', function(data) {
        if (data.data != undefined) {
            var consolestr = data.data;

            if (consolestr.search("Initialized") >= 0) {
                this.runningStatus = "Now running";
                $scope.$apply();
            }
            console.log(consolestr);
        }
      }.bind(this));

      // Keyboard Bindings
      //
      this.lastEvent;
      this.heldKeys = {};

      window.addEventListener('keyup', function (e) {
        this.lastEvent = null;
        delete this.heldKeys[e.keyCode];

        var action = keycodeMap[ e.keyCode ];
        if ($scope.show && action ) {
          if (action == 'stop') {
            // check for an escape key press and kill the modal if it happens
            $scope.vm.stop();
            $scope.$apply();
          } else {
            buttonChanged( action, 'up' );
          }
        }
      }.bind(this));

      window.addEventListener('keydown', function (e) {
        if (this.lastEvent && this.lastEvent.keyCode == e.keyCode) {
              return;
        }
        this.lastEvent = e;
        this.heldKeys[e.keyCode] = true;
        var action = keycodeMap[ e.keyCode ];
        if ($scope.show && action ) {
          buttonChanged( action, 'down' );
        }
      }.bind(this));

    },
    link: function(scope,commands) {
      $('#runningWindow').modal({
        keyboard: false,
        backdrop: 'static',
        show: false
      });
    }
  };

  function buttonChanged(name, state) {
    commands.send('control', [ name, state ]);
  }

  function createCommandHandler(color, state) {
    return function() {
      buttonChanged(color, state);
    }
  }

  function stop(scope) {
    return function() {
      scope.show = false;
      this.runningStatus = "Waiting for connection...";
      commands.send( 'control', 'stop' );
    }
  }
}
