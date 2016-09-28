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

app.controller("TeamsAllController", function($scope, teamsAll) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log(teamsAll.data);
    };

    $scope.view.teams = teamsAll.data;

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
    $scope.changeChartData = function (dataType='points', sortDir) {
        // clear arrays to redraw chart
        $scope.datasetOverride = [];
        $scope.view.teamNames = [];
        chartData = [];
        // sort data based on what column was clicked
        if (sortDir) {
            $scope.view.teams.sort((a,b)=>{return a[dataType]-b[dataType];});
        } else {
            $scope.view.teams.sort((a,b)=>{return b[dataType]-a[dataType];});
        }
        // push data into array and names sorted according to data
        for (let i = 0; i < $scope.view.teams.length; i++) {
            chartData.push(parseInt($scope.view.teams[i][dataType]));
            $scope.view.teamNames.push($scope.view.teams[i].team);
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

app.controller("PlayersIndividualController", function($scope, playersIndividual, PlayerService, ScoreService, $stateParams) {
    $scope.view = {};

    $scope.view.settings = ScoreService.settings;

    $scope.view.playerInfo = playersIndividual.data.playerInfo[0];

    // remove duplicates
    var seenWeeks = [];
    var playerArray = [];
    for (let i = 0; i < playersIndividual.data.playerLog.length; i++) {
        if (seenWeeks.indexOf(parseInt(playersIndividual.data.playerLog[i].week)) < 0) {
            playerArray.push(playersIndividual.data.playerLog[i]);
            seenWeeks.push(parseInt(playersIndividual.data.playerLog[i].week));
        }
    }

    function calculateFantasyPoints(player) {
        var fantasyPoints = 0;
        fantasyPoints += parseInt($scope.view.settings.passTD) * parseInt(player.pass_tds);
        fantasyPoints -= parseInt($scope.view.settings.int) * parseInt(player.interceptions);
        fantasyPoints += parseInt($scope.view.settings.passYD) * parseInt(player.pass_yards);
        fantasyPoints += parseInt($scope.view.settings.rushTD) * parseInt(player.rush_tds);
        fantasyPoints += parseInt(player.rush_yards) / parseInt($scope.view.settings.rushYD);
        fantasyPoints += parseInt($scope.view.settings.recTD) * parseInt(player.rec_tds);
        fantasyPoints += parseInt($scope.view.settings.rec) * parseInt(player.receptions);
        fantasyPoints += parseInt(player.rec_yards) / parseInt($scope.view.settings.recYD);
        return fantasyPoints;
    }

    for (let i = 0; i < playerArray.length; i++) {
        playerArray[i].fantasy = calculateFantasyPoints(playerArray[i]);
    }

    function calculateTotals(arr) {
        $scope.view.displayTotal = { pass_tds : 0, interceptions : 0, pass_yards : 0, rush_tds : 0, rush_yards : 0, rec_tds : 0, receptions : 0, rec_yards : 0 };
        $scope.view.displayFantasy = { pass_tds : 0, interceptions : 0, pass_yards : 0, rush_tds : 0, rush_yards : 0, rec_tds : 0, receptions : 0, rec_yards : 0, total : 0 };
        for (let i = 0; i < arr.length; i++) {
            $scope.view.displayTotal.pass_tds += parseInt(arr[i].pass_tds);
            $scope.view.displayTotal.interceptions += parseInt(arr[i].interceptions);
            $scope.view.displayTotal.pass_yards += parseInt(arr[i].pass_yards);
            $scope.view.displayTotal.rush_tds += parseInt(arr[i].rush_tds);
            $scope.view.displayTotal.rush_yards += parseInt(arr[i].rush_yards);
            $scope.view.displayTotal.rec_tds += parseInt(arr[i].rec_tds);
            $scope.view.displayTotal.receptions += parseInt(arr[i].receptions);
            $scope.view.displayTotal.rec_yards += parseInt(arr[i].rec_yards);
            $scope.view.displayFantasy.pass_tds += parseInt($scope.view.settings.passTD) * parseInt(arr[i].pass_tds);
            $scope.view.displayFantasy.interceptions -= parseInt($scope.view.settings.int) * parseInt(arr[i].interceptions);
            $scope.view.displayFantasy.pass_yards += parseInt(arr[i].pass_yards) / parseInt($scope.view.settings.passYD);
            $scope.view.displayFantasy.rush_tds += parseInt($scope.view.settings.rushTD) * parseInt(arr[i].rush_tds);
            $scope.view.displayFantasy.rush_yards += parseInt(arr[i].rush_yards) / parseInt($scope.view.settings.rushYD);
            $scope.view.displayFantasy.rec_tds += parseInt($scope.view.settings.recTD) * parseInt(arr[i].rec_tds);
            $scope.view.displayFantasy.receptions += parseInt($scope.view.settings.rec) * parseInt(arr[i].receptions);
            $scope.view.displayFantasy.rec_yards += parseInt(arr[i].rec_yards) / parseInt($scope.view.settings.recYD);
        }
        for (var key in $scope.view.displayFantasy) {
            if (key !== 'total'){
                $scope.view.displayFantasy.total += $scope.view.displayFantasy[key];
            }
        }
    }

    $scope.view.displayPlayer = playerArray;

    $scope.weekOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    $scope.changeTableWeeks = function (start=1, end=17) {
        $scope.view.displayPlayer = [];
        var endRange = (end > playerArray.length) ? playerArray.length : end;
        for (let i = start-1; i < endRange; i++) {
            $scope.view.displayPlayer.push(playerArray[i]);
        }
        calculateTotals($scope.view.displayPlayer);
    };

    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    var chartData = [];
    $scope.view.teamNames = [];
    $scope.view.label = '';
    $scope.datasetOverride = [];
    $scope.changeChartData = function (dataType, sortDir, start, end) {
        // clear arrays to redraw chart
        $scope.datasetOverride = [];
        $scope.view.weeks = [];
        chartData = [];
        // sort data based on what column was clicked
        // if (sortDir) {
        //     $scope.view.playerLog.sort((a,b)=>{return a[dataType]-b[dataType];});
        // } else {
        //     $scope.view.playerLog.sort((a,b)=>{return b[dataType]-a[dataType];});
        // }
        // push data into array and names sorted according to data
        for (let i = 0; i < $scope.view.displayPlayer.length; i++) {
            chartData.push(parseInt($scope.view.displayPlayer[i][dataType]));
            $scope.view.weeks.push(`Wk: ${$scope.view.displayPlayer[i].week - 1} - ${$scope.view.displayPlayer[i].opponent}`);
        }
        $scope.data = [chartData];
        $scope.view.label = dataType.replace(/[^a-z0-9]/ig, " ");
        $scope.view.label = $scope.view.label.charAt(0).toUpperCase() + $scope.view.label.slice(1);
        $scope.datasetOverride.push({
                    label: $scope.view.label,
                    borderWidth: 3.5,
                    type: 'line',
                    backgroundColor: "hsla(160, 50%, 50%, 0.3)",
                    strokeColor: "black",
                    hoverBorderColor: "hsla(280, 100%, 30%, 0.7)",
                    defaultFontSize: '70px'
                });
        $scope.options = {
            responsive: false,
            scaleBeginAtZero : true,
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 2,
            barValueSpacing : 5,
            barDatasetSpacing : 1
        }
    };
});

app.controller("TeamsIndividualController", function($scope, teamsIndividual, TeamService, ScoreService, $stateParams) {
    $scope.view = {};
    $scope.clicky = function () {
        console.log($scope.view.displayLogs);
    };

    $scope.view.settings = ScoreService.settings;

    // remove duplicates
    // var seenGames = {};
    // var dataArray = [];
    // for (let i = 0; i < teamsIndividual.data.playerLogs.length; i++) {
    //
    //     if (seenGames[teamsIndividual.data.playerLogs[i].game_id] !== teamsIndividual.data.playerLogs[i].player_team_id) {
    //         console.log('hello')
    //         seenGames[teamsIndividual.data.playerLogs[i].game_id] = teamsIndividual.data.playerLogs[i].player_team_id
    //         dataArray.push(teamsIndividual.data.playerLogs[i]);
    //     }
    // }

    $scope.view.displayLogs = teamsIndividual.data.gameLog;
    // convert numbers from string to int type
    for (let i = 0; i < $scope.view.displayLogs.length; i++) {
        $scope.view.displayLogs[i].week = parseInt($scope.view.displayLogs[i].week);
        $scope.view.displayLogs[i].points_for = parseInt($scope.view.displayLogs[i].points_for);
        $scope.view.displayLogs[i].points_against = parseInt($scope.view.displayLogs[i].points_against);
        $scope.view.displayLogs[i].total_yards_for = parseInt($scope.view.displayLogs[i].total_yards_for);
        $scope.view.displayLogs[i].pass_yards_for = parseInt($scope.view.displayLogs[i].pass_yards_for);
        $scope.view.displayLogs[i].rush_yards_for = parseInt($scope.view.displayLogs[i].rush_yards_for);
        $scope.view.displayLogs[i].turnovers_forced = parseInt($scope.view.displayLogs[i].turnovers_forced);
        $scope.view.displayLogs[i].total_yards_against = parseInt($scope.view.displayLogs[i].total_yards_against);
        $scope.view.displayLogs[i].pass_yards_against = parseInt($scope.view.displayLogs[i].pass_yards_against);
        $scope.view.displayLogs[i].rush_yards_against = parseInt($scope.view.displayLogs[i].rush_yards_against);
        $scope.view.displayLogs[i].turnovers_lost = parseInt($scope.view.displayLogs[i].turnovers_lost);
    }

    // Chart.js data must be nested array i.e. [[1,2,3,4,5]]
    var chartData = [];
    $scope.view.teamNames = [];
    $scope.view.label = '';
    $scope.datasetOverride = [];
    $scope.changeChartData = function (dataType, sortDir, start, end) {
        // clear arrays to redraw chart
        $scope.datasetOverride = [];
        $scope.view.weeks = [];
        chartData = [];
        // sort data based on what column was clicked
        if (sortDir) {
            $scope.view.displayLogs.sort((a,b)=>{return a[dataType]-b[dataType];});
        } else {
            $scope.view.displayLogs.sort((a,b)=>{return b[dataType]-a[dataType];});
        }
        // push data into array and names sorted according to data
        for (let i = 0; i < $scope.view.displayLogs.length; i++) {
            chartData.push(parseInt($scope.view.displayLogs[i][dataType]));
            $scope.view.weeks.push(`Wk: ${$scope.view.displayLogs[i].week - 1} - ${$scope.view.displayLogs[i].opponent}`);
        }
        $scope.data = [chartData];
        $scope.view.label = dataType.replace(/[^a-z0-9]/ig, " ");
        $scope.view.label = $scope.view.label.charAt(0).toUpperCase() + $scope.view.label.slice(1);
        $scope.datasetOverride.push({
                    label: $scope.view.label,
                    borderWidth: 3.5,
                    type: 'line',
                    backgroundColor: "hsla(160, 50%, 50%, 0.3)",
                    strokeColor: "black",
                    hoverBorderColor: "hsla(280, 100%, 30%, 0.7)",
                    defaultFontSize: '70px'
                });
        $scope.options = {
            responsive: false,
            scaleBeginAtZero : true,
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 2,
            barValueSpacing : 5,
            barDatasetSpacing : 1
        }
    };
});
