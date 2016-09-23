app.service("ScoreService", function() {
    this.settings = {};
    this.sendScores = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        this.settings.passTD = passTD;
        this.settings.interval = int;
        this.settings.passYD = passYD;
        this.settings.rushTD = rushTD;
        this.settings.rushYD = rushYD;
        this.settings.recTD = recTD;
        this.settings.rec = rec;
        this.settings.recYD = recYD;
    };
});

app.service("TeamService", function($http) {
    this.showTeams = function(query){
        return $http.get(query);
    };
    this.teamsData = {};
});
app.service("PlayerService", function($http) {
    this.showPlayers = function(query){
        return $http.get(query);
    };
});
