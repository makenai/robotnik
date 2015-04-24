import template from './templates/workshops.html';

export default function(Workshops) {
  return {
    template: template,
    controllerAs: 'vm',
    controller: function() {
      this.workshops = Workshops.query();
    }
  };
}