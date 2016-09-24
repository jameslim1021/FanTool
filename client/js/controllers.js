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
        console.log(teams.data);
    };

    TeamService.teamsData = teams.data;
    $scope.view.teams = TeamService.teamsData;

    $scope.cityTeamMap = {"Redskins":"Washington ", "Eagles":"Philadelphia ", "Giants":"New York ", "Cowboys":"Dallas ",
        "Vikings":"Minnesota ", "Packers":"Green Bay ", "Lions":"Detroit ", "Bears":"Chicago ",
        "Panthers":"Carolina ", "Falcons":"Atlanta ", "Saints":"New Orleans ", "Buccaneers":"Tampa Bay ",
        "Cardinals":"Arizona ", "Seahawks":"Seattle ", "Rams":"St. Louis ", "49ers":"San Francisco ",
        "Patriots":"New England ", "Jets":"New York ", "Bills":"Buffalo ", "Dolphins":"Miami ",
        "Bengals":"Cincinnati ", "Steelers":"Pittsburgh ", "Ravens":"Baltimore ", "Browns":"Cleveland ",
        "Texans":"Houston ", "Colts":"Indianapolis ", "Jaguars":"Jacksonville ", "Titans":"Tennessee ",
        "Broncos":"Denver ", "Chiefs":"Kansas City ", "Raiders":"Oakland ", "Chargers":"San Diego "};

    // convert numbers from string to int type
    for (let i = 0; i < teams.data.length; i++) {
        teams.data[i].wins = parseInt(teams.data[i].record.split('-')[0]);
        teams.data[i].losses = parseInt(teams.data[i].record.split('-')[1]);
        teams.data[i].points = parseInt(teams.data[i].points);
        teams.data[i].total_yards = parseInt(teams.data[i].total_yards);
        teams.data[i].attempts = parseInt(teams.data[i].attempts);
        teams.data[i].completions = parseInt(teams.data[i].completions);
        teams.data[i].pass_yards = parseInt(teams.data[i].pass_yards);
        teams.data[i].pass_tds = parseInt(teams.data[i].pass_tds);
        teams.data[i].interceptions = parseInt(teams.data[i].interceptions);
        teams.data[i].carries = parseInt(teams.data[i].carries);
        teams.data[i].rush_tds = parseInt(teams.data[i].rush_tds);
        teams.data[i].rush_yards = parseInt(teams.data[i].rush_yards);
        teams.data[i].turnovers = parseInt(teams.data[i].turnovers);
    }

    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    var chartData = [];
    $scope.view.teamNames = [];
    $scope.view.label = '';
    $scope.datasetOverride = [];
    $scope.changeChartData = function (dataType, sortDir) {
        // clear arrays to redraw chart
        $scope.datasetOverride = [];
        $scope.view.teamNames = [];
        chartData = [];
        // sort data based on what column was clicked
        if (dataType === 'record') {
            if (sortDir) {
                teams.data.sort((a,b)=>{return parseInt(a[dataType].split('-')[0])-parseInt(b[dataType].split('-')[0]);});
                console.log(teams.data)
            } else {
                teams.data.sort((a,b)=>{return parseInt(b[dataType].split('-')[0])-parseInt(a[dataType].split('-')[0]);});
            }
        } else {
            if (sortDir) {
                teams.data.sort((a,b)=>{return a[dataType]-b[dataType];});
            } else {
                teams.data.sort((a,b)=>{return b[dataType]-a[dataType];});
            }
        }
        // push data into array and names sorted according to data
        for (let i = 0; i < teams.data.length; i++) {
            chartData.push(parseInt(teams.data[i][dataType]));
            $scope.view.teamNames.push(teams.data[i].team);
        }
        $scope.data = [chartData];
        $scope.view.label = dataType.replace(/[^a-z0-9]/ig, " ");
        $scope.view.label = $scope.view.label.charAt(0).toUpperCase() + $scope.view.label.slice(1);
        $scope.datasetOverride.push({
                    label: $scope.view.label,
                    borderWidth: 3.5,
                    type: 'line',
                    backgroundColor: "hsla(160, 50%, 50%, 0.3)",
                    hoverBorderColor: "rgba(255,99,132,1)"
                });
    };

});
