const app = angular.module("myApp", ["ui.router"]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/home-content.html'
                }
            }
        })
        .state('main', {
            url:'/main',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/score-setting.html',
                    controller: 'ScoreController'
                }
            }
        })
}]);
