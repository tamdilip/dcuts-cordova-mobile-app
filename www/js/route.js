app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'views/login.html'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'views/main.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html'
        })
        .state('videostream', {
            url: '/videostream',
            templateUrl: 'views/videostream.html'
        })
}]);