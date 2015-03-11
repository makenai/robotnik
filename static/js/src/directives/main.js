import template from './templates/main.html';

export default function() {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function() {
      this.showControls = false;
      this.executeCode = executeCode;

      function executeCode() {
        this.showControls = true;
      }
    }
  };
}