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
    }
  };

  function createCommandHandler(color, direction) {
    return function() {
      commands.send('control', `${color}_${direction}`);
    }
  }

  function stop() {
    commands.send( 'control', 'stop' );
  }
}