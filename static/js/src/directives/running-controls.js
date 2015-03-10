import template from './templates/running-controls.html';

export default function(commands) {
  return {
    template: template,
    controllerAs: 'vm',
    scope: {},
    controller: function() {
      this.stop = stop;
    }
  };

  function stop() {
    commands.send( 'control', 'stop' );
  }
}