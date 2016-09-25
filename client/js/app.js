const app = angular.module("myApp", ["ui.router", "chart.js"]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $http) {
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
        .state('teams', {
            url:'/teams',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/teams.html',
                    controller: 'TeamsController',
                    resolve: {
                        teams: function(TeamService) {
                            return TeamService.showTeams('/api/teams');
                        }
                    }
                }
            }
        })
        .state('teams.year', {
            url:'/:year',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/teams.html',
                    resolve: {
                        teams: ['$stateParams', 'TeamService', function($stateParams, TeamService) {
                            console.log($stateParams.year)
                            return TeamService.showTeams('/api/teams/' + $stateParams.year);
                        }]
                    }
                }
            }
        })
        .state('players', {
            url:'/players',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/players.html',
                    controller: 'PlayersController',
                    resolve: {
                        players: function(PlayerService) {
                            return PlayerService.showPlayers('/api/players');
                        }
                    }
                }
            }
        })
}]);
