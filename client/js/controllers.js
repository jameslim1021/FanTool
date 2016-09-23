"use strict";

app.controller("ScoreController", function($scope, ScoreService) {
    $scope.view = {};
    $scope.view.settings = {};
    $scope.submitScore = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        ScoreService.sendScores(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD);
        $scope.view.settings1 = ScoreService.settings;
    };
});

app.controller("PlayersController", function($scope, PlayerService, players) {
    $scope.clicky = function () {
        console.log(players.data);
    };
});

app.controller("TeamsController", function($scope, TeamService, teams) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log(teams.data[0]);
    };

    var chartData = [];
    $scope.view.teams = []
    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    var chartData = [];
    for (let i = 0; i < teams.data.length; i++) {
        chartData.push(parseInt(teams.data[i].points));
        $scope.view.teams.push(teams.data[i].team)
    }

    chartData.sort();
    $scope.data = [chartData];
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
