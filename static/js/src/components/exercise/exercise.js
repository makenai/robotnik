import template from './exercise.html';

export default function(commands) {
  return {
    template: template,
    controllerAs: 'vm',
    scope: {
      workshop: '=?'
    },
    controller: function($scope) {
      this.workshop = $scope.workshop;
      this.exercise = this.workshop.getExercise();
    }
  };
}
