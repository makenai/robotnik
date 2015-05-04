function routes($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/workshops");

  $stateProvider
    .state('workshops', {
      url: '/workshops',
      template: "<workshops></workshops>"
    })
    .state('workshop', {
      url: '/workshops/:workshopId',
      template: "<workshop></workshop>"
    });

}

export default routes;
