app.controller("ScoreController", function($scope, scoreService) {
    $scope.view = {};
    $scope.view.settings = {};
    $scope.submitScore = function(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD) {
        scoreService.sendScores(passTD, int, passYD, rushTD, rushYD, recTD, rec, recYD);
        $scope.view.settings1 = scoreService.settings;
    };
    $scope.clicky = function () {
        console.log($scope.view.settings1)
    }
});
