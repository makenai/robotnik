function routes($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/workshops");

  function defaultModelController($scope, model) {
    $scope.model = model;
  }

  $stateProvider
    .state('workshops', {
      url: '/workshops',
      template: '<workshops model="model"></workshops>',
      controller: defaultModelController,
      resolve: {
        model: function(Workshops){
          return Workshops.query();
        }
      }
    })
    .state('workshop', {
      url: '/workshops/:workshopId/:exercise',
      template: '<workshop model="model"></workshop>',
      controller: defaultModelController,
      resolve: {
        model: function(Workshops, $stateParams) {
          return Workshops.get($stateParams.workshopId);
        }
      }
    });

}

export default routes;
