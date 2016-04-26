import template from './workshops.html';

export default function(Workshops) {
  return {
    template: template,
    controllerAs: 'vm',
    restrict: 'E',
    scope: {
      model: '='
    },
    controller: function($scope) {
      this.workshops = $scope.model;
    }
  };
}
