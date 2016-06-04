import template from './workshop.html';
import Toolbox from '../../lib/toolbox';

export default function($timeout, $stateParams, code, blockly, Workspaces) {
  return {
    template: template,
    controllerAs: 'vm',
    restrict: 'E',
    scope: {
      model: '='
    },
    controller: function($scope) {
      this.workshop = $scope.model;
      this.exerciseId = $stateParams.exercise - 1; // urls are kept pretty
      this.workshop.setExercise( this.exerciseId);
      this.selected = 'blocks';
      this.selectBlocks = selectBlocks;
      this.selectCode = selectCode;
      restoreWorkspace( this.workshop.getId() );

      code.setWorkshop( this.workshop );

      function selectBlocks() {
        this.selected = 'blocks';
        // trigger a redraw to get everything to render again properly
        Blockly.fireUiEvent(window, 'resize');
      }

      function selectCode() {
        this.selected = 'code';
        this.code = code.generate();
        // trigger a redraw to get everything to render again properly.
        Blockly.fireUiEvent(window, 'resize');
      }

      function restoreWorkspace(workshopId) {
        Workspaces.load( workshopId ).then(function(result) {
          if ( result ) {
            blockly.reloadWorkspace( result.data );
          }
        });
      }

    },
    link: function(scope, element) {

      var workshop = scope.model;
      var toolbox = new Toolbox(workshop);
      $timeout(function() {
        blockly.init(element.find('#blockly')[0], toolbox);
      }, 0, false);

      $( window ).resize(function() {
        element.find('.tab-content').css('height', $(window).height() - 100 + 'px' );
      });

    }
  };
}
