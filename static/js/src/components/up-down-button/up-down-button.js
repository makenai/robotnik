import template from './up-down-button.html';

export default function() {
  return {
    template: template,
    controllerAs: 'vm',
    scope: {
      label: '@',
      className: '@',
      onUp: '&?',
      onDown: '&?'
    },
    link: function(scope, element) {
      $(element).find('button').mousedown(function() {
        scope.$apply(function() {
          scope.onDown();
        });
      });

      $(element).find('button').mouseup(function() {
        scope.$apply(function() {
          scope.onUp();
        });
      });
    }
  };
}