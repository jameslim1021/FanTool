"use strict"

app.controller("ScoreController", function($scope, scoreService) {
    $scope.view = {};
    $scope.view.settings = {};
    $scope.submitScore = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        scoreService.sendScores(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD);
        $scope.view.settings1 = scoreService.settings;
    };
});

app.controller("TeamsController", function($scope, teamService) {
    $scope.view = {};
    $scope.view.teams = teamService.teams;
    $scope.clicky = function () {
        console.log($scope.data);
    };

    $scope.teams = Object.keys($scope.view.teams);
    $scope.data = [];

    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    var chartData = [];
    for (let i = 0; i < $scope.teams.length; i++) {
        chartData.push($scope.view.teams[$scope.teams[i]][1].passYardsFor);
    }

    chartData.sort();
    $scope.data.push(chartData);

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
