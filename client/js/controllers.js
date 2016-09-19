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
        console.log(rowData);
    };

    $scope.teamsChart = {};
    $scope.teamsChart.type = "BarChart";

    let teams = Object.keys($scope.view.teams);

    var rowData = [];
    for (let i = 0; i < teams.length; i++) {
        let temp = {c:[
            {v: teams[i]},
            {v: $scope.view.teams[teams[i]][1]["passYardsFor"]}
        ]};
        rowData.push(temp);
    }

    rowData.sort((a,b)=>{return b.c[1].v-a.c[1].v;});
    $scope.teamsChart.data = {"cols": [
        {id: "t", label: "Teams", type: "string"},
        {id: "p", label: "Points", type: "number"},
        {role: "style", type: "string"}
    ], "rows": rowData};

    $scope.example = "helloworld";

    $scope.teamsChart.options = {
        'title': $scope.example,
         "hAxis":{label:"Teams","showTextEvery":1},
    };
});
