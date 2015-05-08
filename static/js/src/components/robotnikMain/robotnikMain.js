import template from './robotnikMain.html';

export default function($timeout, $stateParams, code, blockly) {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function() {
      this.showControls = false;
      this.executeCode = executeCode;
      this.saveWorkspace = saveWorkspace;
      this.stateParams = $stateParams;

      function executeCode() {
        this.showControls = true;
        code.execute(this.selected === 'code' ? this.code : null );
      }

      function saveWorkspace() {
        var workshopId = $stateParams.workshopId;
        blockly.saveWorkspace( workshopId );
      }

    },
    link: function(scope, element) {
      $( window ).resize(function() {
        element.find('#runningWindow').css({
          top: ( $(window).height() / 2 ) - ( element.find('#runningWindow').height() / 2 ),
          left: ( $(window).width() / 2 ) - ( element.find('#runningWindow').width() / 2 )
        });
      });
    }
  };
}
