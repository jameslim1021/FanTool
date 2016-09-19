"use strict";

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
    $scope.teams = teamService.teams;
    $scope.clicky = function () {
        console.log($scope.teams.AFCwest);
    };

    // array of team names to display in table
    $scope.view.afcWest = Object.keys($scope.teams.AFCwest);
    $scope.view.afcEast = Object.keys($scope.teams.AFCeast);
    $scope.view.afcNorth = Object.keys($scope.teams.AFCnorth);
    $scope.view.afcSouth = Object.keys($scope.teams.AFCsouth);
    $scope.view.nfcWest = Object.keys($scope.teams.NFCwest);
    $scope.view.nfcEast = Object.keys($scope.teams.NFCeast);
    $scope.view.nfcNorth = Object.keys($scope.teams.NFCnorth);
    $scope.view.nfcSouth = Object.keys($scope.teams.NFCsouth);

    $scope.view.teams = Object.keys($scope.teams);
    $scope.data = [];

    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    // var chartData = [];
    // for (let i = 0; i < $scope.view.teams.length; i++) {
    //     chartData.push($scope.teams[$scope.view.teams[i]][1].passYardsFor);
    // }
    //
    // chartData.sort();
    $scope.data.push($scope.view.teams);

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
