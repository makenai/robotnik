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
      }

      function selectCode() {
        this.selected = 'code';
        this.code = code.generate();
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
      console.log(toolbox.xml);
      $timeout(function() {
        blockly.init(element.find('#blockly')[0], toolbox.xml, workshop);
      }, 0, false);

      $( window ).resize(function() {
        element.find('.tab-content').css('height', $(window).height() - 100 + 'px' );
      });

    }
  };
}
