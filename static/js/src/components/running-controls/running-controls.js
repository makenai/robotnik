import template from './running-controls.html';

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
                console.log(this);
                this.runningStatus = "Now running";
                $scope.$apply();
            }
            console.log(consolestr);
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
