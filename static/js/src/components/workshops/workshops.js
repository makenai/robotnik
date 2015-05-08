import template from './workshops.html';

export default function(Workshops) {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function($scope) {
      Workshops.query().then(function(workshops) {
        this.workshops = workshops;
      }.bind(this));
    }
  };
}
