app.service("scoreService", function() {
    this.settings = {};
    this.sendScores = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        this.settings["passTD"] = passTD;
        this.settings["int"] = int;
        this.settings["passYD"] = passYD;
        this.settings["rushTD"] = rushTD;
        this.settings["rushYD"] = rushYD;
        this.settings["recTD"] = recTD;
        this.settings["rec"] = rec;
        this.settings["recYD"] = recYD;
    };
});
