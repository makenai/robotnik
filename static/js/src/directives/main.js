import template from './templates/main.html';

export default function() {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function(code) {
      this.showControls = false;
      this.executeCode = executeCode;
      this.generateCode = generateCode;

      function executeCode() {
        this.showControls = true;
      }

      function generateCode() {
        this.code = code.generate();
      }
    }
  };
}