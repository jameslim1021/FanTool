"use strict";

app.controller("ScoreController", function($scope, ScoreService) {
    $scope.view = {};
    $scope.view.settings = {};
    $scope.submitScore = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        ScoreService.sendScores(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD);
        $scope.view.settings1 = ScoreService.settings;
    };
});

app.controller("PlayersController", function($scope, PlayerService, players, ScoreService) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log($scope.view.players);
    };

    PlayerService.playersData = players.data;
    $scope.view.players = PlayerService.playersData;
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
    // convert numbers from string to int type
    for (let i = 0; i < $scope.view.players.length; i++) {
        $scope.view.players[i].id = parseInt($scope.view.players[i].id);
        $scope.view.players[i].attempts = parseInt($scope.view.players[i].attempts);
        $scope.view.players[i].carries = parseInt($scope.view.players[i].carries);
        $scope.view.players[i].completions = parseInt($scope.view.players[i].completions);
        $scope.view.players[i].games_played = parseInt($scope.view.players[i].games_played);
        $scope.view.players[i].games_started = parseInt($scope.view.players[i].games_started);
        $scope.view.players[i].interceptions = parseInt($scope.view.players[i].interceptions);
        $scope.view.players[i].pass_yards = parseInt($scope.view.players[i].pass_yards);
        $scope.view.players[i].pass_tds = parseInt($scope.view.players[i].pass_tds);
        $scope.view.players[i].rec_tds = parseInt($scope.view.players[i].rec_tds);
        $scope.view.players[i].rec_yards = parseInt($scope.view.players[i].rec_yards);
        $scope.view.players[i].rush_tds = parseInt($scope.view.players[i].rush_tds);
        $scope.view.players[i].rush_yards = parseInt($scope.view.players[i].rush_yards);
        $scope.view.players[i].receptions = parseInt($scope.view.players[i].receptions);
        $scope.view.players[i].targets = parseInt($scope.view.players[i].targets);
        $scope.view.players[i].fantasy = calculateFantasyPoints($scope.view.players[i]);
    }

    var chartData = [];
    $scope.view.playerNames = [];
    $scope.view.label = '';
    $scope.datasetOverride = [];
    $scope.changeChartData = function (dataType, sortDir) {
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
            chartData.push(parseInt($scope.view.players[i][dataType]));
            $scope.view.playerNames.push($scope.view.players[i].name);
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
