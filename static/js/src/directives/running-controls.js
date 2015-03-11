import template from './templates/running-controls.html';

export default function(commands) {
  return {
    template: template,
    controllerAs: 'vm',
    scope: {},
    controller: function() {
      this.stop = stop;
      this.redDown = createCommandHandler('red', 'down');
      this.redUp = createCommandHandler('red', 'up');
      this.greenDown = createCommandHandler('green', 'down');
      this.greenUp = createCommandHandler('green', 'up');
      this.joystickMove = joystickMove;
    }
  };

  function createCommandHandler(color, state) {
    return function() {
      commands.send('control', `${color}_${state}`);
    }
  }

  function joystickMove(direction, state) {
    commands.send('control', `${direction}_${state}`);
  }

  function stop() {
    commands.send( 'control', 'stop' );
  }
}