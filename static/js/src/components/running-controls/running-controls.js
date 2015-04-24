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
    }
  };

  function buttonChanged(name, state) {
    commands.send('control', `${name}_${state}`);
  }

  function createCommandHandler(color, state) {
    return function() {
      buttonChanged(color, state);
    }
  }

  function stop(scope) {
    return function() {
      scope.show = false;
      commands.send( 'control', 'stop' );
    }
  }
}