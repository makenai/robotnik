import template from './robotnikMain.html';

export default function($timeout, code, blockly) {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function() {
      this.showControls = false;
      this.executeCode = executeCode;
      
      function executeCode() {
        this.showControls = true;
        code.execute(this.selected === 'code' ? this.code : null );
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