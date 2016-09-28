app.service("ScoreService", function() {
    this.settings = {};
    this.sendScores = function(passTD=4, int=2, passYD=25, rushTD=6, rushYD=10, recTD=6, rec=0, recYD=10) {
        this.settings.passTD = passTD;
        this.settings.int = int;
        this.settings.passYD = passYD;
        this.settings.rushTD = rushTD;
        this.settings.rushYD = rushYD;
        this.settings.recTD = recTD;
        this.settings.rec = rec;
        this.settings.recYD = recYD;
        console.log(this.settings)
    };
});

app.service("TeamService", function($http) {
    this.showAllTeams = function(query){
        this.teamsData = $http.get(query).then(function(teams) {
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
            return teams;
        }).catch(function(err) {
            console.log(err);
        });
        return this.teamsData;
    };
    this.showIndividualTeam = function(query){
        this.teamsData = $http.get(query).then(function(teams) {
            return teams;
        }).catch(function(err) {
            console.log(err);
        });
        return this.teamsData;
    };
    return this;
});

app.service("PlayerService", function($http) {
    this.showAllPlayers = function(query){
        this.playerTotals = $http.get(query).then(function(players) {
            // convert numbers from string to int type
            for (let i = 0; i < players.data.length; i++) {
                players.data[i].id = parseInt(players.data[i].id);
                players.data[i].attempts = parseInt(players.data[i].attempts);
                players.data[i].carries = parseInt(players.data[i].carries);
                players.data[i].completions = parseInt(players.data[i].completions);
                players.data[i].games_played = parseInt(players.data[i].games_played);
                players.data[i].games_started = parseInt(players.data[i].games_started);
                players.data[i].interceptions = parseInt(players.data[i].interceptions);
                players.data[i].pass_yards = parseInt(players.data[i].pass_yards);
                players.data[i].pass_tds = parseInt(players.data[i].pass_tds);
                players.data[i].rec_tds = parseInt(players.data[i].rec_tds);
                players.data[i].rec_yards = parseInt(players.data[i].rec_yards);
                players.data[i].rush_tds = parseInt(players.data[i].rush_tds);
                players.data[i].rush_yards = parseInt(players.data[i].rush_yards);
                players.data[i].receptions = parseInt(players.data[i].receptions);
                players.data[i].targets = parseInt(players.data[i].targets);
            }
            return players;
        }).catch(function(err) {
            console.log(err);
        });
        return this.playerTotals;
    };
    this.showIndividualPlayer = function(query){
        this.playerInfo = $http.get(query).then(function(players) {
            // convert numbers from string to int type
            for (let i = 0; i < players.data.length; i++) {
                players.data[i].week = parseInt(players.data[i].week);
                players.data[i].attempts = parseInt(players.data[i].attempts);
                players.data[i].completions = parseInt(players.data[i].completions);
                players.data[i].pass_yards = parseInt(players.data[i].pass_yards);
                players.data[i].pass_tds = parseInt(players.data[i].pass_tds);
                players.data[i].interceptions = parseInt(players.data[i].interceptions);
                players.data[i].pass_long = parseInt(players.data[i].pass_long);
                players.data[i].times_sacked = parseInt(players.data[i].times_sacked);
                players.data[i].targets = parseInt(players.data[i].targets);
                players.data[i].receptions = parseInt(players.data[i].receptions);
                players.data[i].rec_tds = parseInt(players.data[i].rec_tds);
                players.data[i].rec_yards = parseInt(players.data[i].rec_yards);
                players.data[i].rec_long = parseInt(players.data[i].rec_long);
                players.data[i].carries = parseInt(players.data[i].carries);
                players.data[i].rush_yards = parseInt(players.data[i].rush_yards);
                players.data[i].rush_tds = parseInt(players.data[i].rush_tds);
                players.data[i].rush_long = parseInt(players.data[i].rush_long);
                players.data[i].fumbles = parseInt(players.data[i].fumbles);
                players.data[i].fumbles_lost = parseInt(players.data[i].fumbles_lost);
            }
            return players;
        }).catch(function(err) {
            console.log(err);
        });
        return this.playerInfo;
    };
    return this;
});
