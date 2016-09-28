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
                    templateUrl: '../templates/score-setting.html',
                    controller: 'ScoreController'
                }
            }
        })
        // .state('main', {
        //     url:'/main',
        //     views: {
        //         'header': {
        //             templateUrl: '../templates/header.html'
        //         },
        //         'mainContent': {
        //             templateUrl: '../templates/score-setting.html',
        //             controller: 'ScoreController'
        //         }
        //     }
        // })
        .state('teams', {
            url:'/teams',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/teams-main.html',
                }
            }
        })
        .state('teams.year', {
            url:'/:year',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'teamContent': {
                    templateUrl: '../templates/teams-content.html',
                    controller: 'TeamsAllController',
                    resolve: {
                        teamsAll: ['$stateParams', 'TeamService', function($stateParams, TeamService) {
                            return TeamService.showAllTeams('/api/teams/' + $stateParams.year);
                        }]
                    }
                }
            }
        })
        .state('team', {
            url:'/team',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/teams-main.html',
                }
            }
        })
        .state('team.name', {
            url:'/:name',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'teamContent': {
                    templateUrl: '../templates/team-page.html',
                    controller: 'TeamsIndividualController',
                    resolve: {
                        teamsIndividual: ['$stateParams', 'TeamService', function($stateParams, TeamService) {
                            console.log($stateParams.year)
                            return TeamService.showIndividualTeam('/api/teams/2015/' + $stateParams.name);
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
                    templateUrl: '../templates/players-main.html',
                }
            }
        })
        .state('players.year', {
            url:'/:year',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'playerContent': {
                    templateUrl: '../templates/player-content.html',
                    controller: 'PlayersAllController',
                    resolve: {
                        playersAll: ['$stateParams', 'PlayerService', function($stateParams, PlayerService) {
                            return PlayerService.showAllPlayers('/api/players/' + $stateParams.year);
                        }]
                    }
                }
            }
        })
        .state('player', {
            url:'/player',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'mainContent': {
                    templateUrl: '../templates/players-main.html',
                }
            }
        })
        .state('player.name', {
            url:'/:name',
            views: {
                'header': {
                    templateUrl: '../templates/header.html'
                },
                'playerContent': {
                    templateUrl: '../templates/player-page.html',
                    controller: 'PlayersIndividualController',
                    resolve: {
                        playersIndividual: ['$stateParams', 'PlayerService', function($stateParams, PlayerService) {
                            return PlayerService.showIndividualPlayer('/api/players/2015' + '/' + $stateParams.name);
                        }]
                    }
                }
            }
        })
        // .state('player.name.year', {
        //     url:'/:year',
        //     views: {
        //         'header': {
        //             templateUrl: '../templates/header.html'
        //         },
        //         'playerContent': {
        //             templateUrl: '../templates/player-page.html',
        //             resolve: {
        //                 playersIndividual: ['$stateParams', 'PlayerService', function($stateParams, PlayerService) {
        //                     return PlayerService.showIndividualPlayer('/api/players/' + $stateParams.year + '/' + $stateParams.name);
        //                 }]
        //             }
        //         }
        //     }
        // })
}]);
