"use strict";

app.controller("ScoreController", function($scope, ScoreService) {
    $scope.view = {};
    $scope.view.settings = {};
    $scope.submitScore = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        ScoreService.sendScores(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD);
        $scope.view.settings1 = ScoreService.settings;
    };
});

app.controller("PlayersAllController", function($scope, playersAll, ScoreService, $stateParams) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log($scope.view.players);
    };
    console.log($scope.view.players, 'all player controller')
    $scope.view.players = playersAll.data;

    $scope.view.settings = ScoreService.settings;

    function calculateFantasyPoints(player) {
        var fantasyPoints = 0;
        fantasyPoints += parseInt($scope.view.settings.passTD) * parseInt(player.pass_tds);
        fantasyPoints -= parseInt($scope.view.settings.int) * parseInt(player.interceptions);
        fantasyPoints += parseInt(player.pass_yards) / parseInt($scope.view.settings.passYD);
        fantasyPoints += parseInt($scope.view.settings.rushTD) * parseInt(player.rush_tds);
        fantasyPoints += parseInt(player.rush_yards) / parseInt($scope.view.settings.rushYD);
        fantasyPoints += parseInt($scope.view.settings.recTD) * parseInt(player.rec_tds);
        fantasyPoints += parseInt($scope.view.settings.rec) * parseInt(player.receptions);
        fantasyPoints += parseInt(player.rec_yards) / parseInt($scope.view.settings.recYD);
        return fantasyPoints;
    }
    for (let i = 0; i < $scope.view.players.length; i++) {
        playersAll.data[i].fantasy = calculateFantasyPoints(playersAll.data[i]);
    }

    var chartData = [];
    $scope.view.playerNames = [];
    $scope.view.label = '';
    $scope.datasetOverride = [];
    $scope.changeChartData = function (dataType, sortDir, nameFilter, teamFilter, posFilter) {
        // clear arrays to redraw chart
        $scope.datasetOverride = [];
        $scope.view.playerNames = [];
        chartData = [];
        // sort data based on what column was clicked
        if (sortDir) {
            $scope.view.players.sort((a,b)=>{return a[dataType]-b[dataType];});
        } else {
            $scope.view.players.sort((a,b)=>{return b[dataType]-a[dataType];});
        }
        // push data into array and names sorted according to data
        for (let i = 0; i < $scope.view.players.length; i++) {
            if (teamFilter) {
                console.log(teamFilter)
                if ($scope.view.players[i].team.toLowerCase().includes(teamFilter)) {
                    chartData.push(parseInt($scope.view.players[i][dataType]));
                    $scope.view.playerNames.push($scope.view.players[i].name);
                }
            } else if (posFilter) {
                if ($scope.view.players[i].position.toLowerCase().includes(posFilter)) {
                    chartData.push(parseInt($scope.view.players[i][dataType]));
                    $scope.view.playerNames.push($scope.view.players[i].name);
                }
            } else if (nameFilter) {
                if ($scope.view.players[i].name.toLowerCase().includes(nameFilter)) {
                    chartData.push(parseInt($scope.view.players[i][dataType]));
                    $scope.view.playerNames.push($scope.view.players[i].name);
                }
            } else {
                chartData.push(parseInt($scope.view.players[i][dataType]));
                $scope.view.playerNames.push($scope.view.players[i].name);
            }
        }
        $scope.data = [chartData];
        $scope.view.label = dataType.replace(/[^a-z0-9]/ig, " ");
        $scope.view.label = $scope.view.label.charAt(0).toUpperCase() + $scope.view.label.slice(1);
        $scope.datasetOverride.push({
                    label: $scope.view.label,
                    borderWidth: 3.5,
                    type: 'bar',
                    backgroundColor: "hsla(160, 50%, 50%, 0.3)",
                    strokeColor: "black",
                    hoverBorderColor: "hsla(280, 100%, 30%, 0.7)",
                    defaultFontSize: '70px'
                });
        $scope.options = {
            fontSize: '70px'
        }
    };
});

app.controller("TeamsController", function($scope, teams) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log(teams.data);
    };

    $scope.view.teams = teams.data;

    $scope.cityTeamMap = {"Redskins":"Washington ", "Eagles":"Philadelphia ", "Giants":"New York ", "Cowboys":"Dallas ",
        "Vikings":"Minnesota ", "Packers":"Green Bay ", "Lions":"Detroit ", "Bears":"Chicago ",
        "Panthers":"Carolina ", "Falcons":"Atlanta ", "Saints":"New Orleans ", "Buccaneers":"Tampa Bay ",
        "Cardinals":"Arizona ", "Seahawks":"Seattle ", "Rams":"St. Louis ", "49ers":"San Francisco ",
        "Patriots":"New England ", "Jets":"New York ", "Bills":"Buffalo ", "Dolphins":"Miami ",
        "Bengals":"Cincinnati ", "Steelers":"Pittsburgh ", "Ravens":"Baltimore ", "Browns":"Cleveland ",
        "Texans":"Houston ", "Colts":"Indianapolis ", "Jaguars":"Jacksonville ", "Titans":"Tennessee ",
        "Broncos":"Denver ", "Chiefs":"Kansas City ", "Raiders":"Oakland ", "Chargers":"San Diego "};

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
        if (sortDir) {
            teams.data.sort((a,b)=>{return a[dataType]-b[dataType];});
        } else {
            teams.data.sort((a,b)=>{return b[dataType]-a[dataType];});
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
                    type: 'bar',
                    backgroundColor: "hsla(160, 50%, 50%, 0.3)",
                    strokeColor: "black",
                    hoverBorderColor: "hsla(280, 100%, 30%, 0.7)",
                    defaultFontSize: '70px'
                });
        $scope.options = {
            fontSize: '70px'
        }
    };
});

app.controller("PlayersIndividualController", function($scope, playersIndividual, ScoreService, $stateParams) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log($scope.view.players);
    };

    $scope.view.players = playersIndividual.data;
    console.log($scope.view.players, 'indie controller')
});
