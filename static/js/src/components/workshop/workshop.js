import template from './workshop.html';

export default function($timeout, $stateParams, code, blockly, Workspaces) {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function() {
      this.selected = 'blocks';
      this.selectBlocks = selectBlocks;
      this.selectCode = selectCode;
      this.workspaces = [];
      this.workshopId = $stateParams.workshopId;
      // processWorkspaces();

      function selectBlocks() {
        this.selected = 'blocks';
      }

      function selectCode() {
        this.selected = 'code';
        this.code = code.generate();
      }

      function processWorkspaces(workspaces) {
        if(workspaces.length) {
          let workspace = workspaces[0];
          blockly.reloadWorkspace(workspace.data);
        }
        return workspaces;
      }

    },
    link: function(scope, element) {

      $timeout(function() {
        blockly.init(element.find('#blockly')[0], element.find('#toolbox')[0]);
      }, 0, false);

      $( window ).resize(function() {
        element.find('.tab-content').css('height', $(window).height() - 100 + 'px' );
      });

    }
  };
}
