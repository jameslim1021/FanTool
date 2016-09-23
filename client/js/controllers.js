"use strict";

app.controller("ScoreController", function($scope, ScoreService) {
    $scope.view = {};
    $scope.view.settings = {};
    $scope.submitScore = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        ScoreService.sendScores(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD);
        $scope.view.settings1 = ScoreService.settings;
    };
});

app.controller("PlayersController", function($scope, PlayerService, teams) {
    $scope.clicky = function () {
        console.log(teams.data);
    };
});

app.controller("TeamsController", function($scope, TeamService, teams) {
    $scope.view = {};
    $scope.teams = TeamService.teams;
    $scope.clicky = function () {
        console.log(teams.data);
    };


    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    // var chartData = [];
    // for (let i = 0; i < $scope.view.teams.length; i++) {
    //     chartData.push($scope.teams[$scope.view.teams[i]][1].passYardsFor);
    // }
    //
    // chartData.sort();

    $scope.datasetOverride = [
          {
            label: "Pass Yards For",
            borderWidth: 1,
            type: 'line',
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)"
          }
    ];
});
