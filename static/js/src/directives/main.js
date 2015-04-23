import template from './templates/main.html';

export default function($timeout, code, blockly, Workshops) {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function() {
      this.selected = 'blocks';
      this.showControls = false;
      this.executeCode = executeCode;
      this.selectBlocks = selectBlocks;
      this.selectCode = selectCode;
      this.workshops = Workshops.query();

      function executeCode() {
        this.showControls = true;
        code.execute(this.selected === 'code' ? this.code : null );
      }

      function selectBlocks() {
        this.selected = 'blocks';
      }

      function selectCode() {
        this.selected = 'code';
        this.code = code.generate();
      }
    },
    link: function(scope, element) {
      $timeout(function() {
        blockly.init(element.find('#blockly')[0], element.find('#toolbox')[0]);  
      }, 0, false);

      $( window ).resize(function() {
        element.find('.tab-content').css('height', $(window).height() - 100 + 'px' );
        element.find('#runningWindow').css({
          top: ( $(window).height() / 2 ) - ( element.find('#runningWindow').height() / 2 ),
          left: ( $(window).width() / 2 ) - ( element.find('#runningWindow').width() / 2 )
        });
      });
    }
  };
}