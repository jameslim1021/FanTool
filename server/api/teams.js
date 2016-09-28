var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
	knex('teams')
	.select('teams.name as team', 'games.record as record', 'teams_totals.*')
	.join('teams_totals', 'teams_totals.team_id', 'teams.id')
	.join('games', 'games.team_id', 'teams.id')
	.where('teams_totals.season',2016)
	.where('games.week',4)
	.where('games.season',2016)
	.then(function(result) {
		console.log('/teams')
		res.send(result);
	});
});

router.get('/:year', function(req, res, next) {
	var week = (parseInt(req.params.year) === 2016) ? 4 : 17;
	knex('teams')
	.select('teams.name as team', 'games.record as record', 'teams_totals.*')
	.join('teams_totals', 'teams_totals.team_id', 'teams.id')
	.join('games', 'games.team_id', 'teams.id')
	.where('teams_totals.season', parseInt(req.params.year))
	.where('games.week', week)
	.where('games.season', parseInt(req.params.year))
	.then(function(result) {
		res.send(result);
	});
});

router.get('/:year/:name', function(req, res, next) {
	knex('teams')
	.select('teams.name as team', 'teams.city as city', 'games.*', 'o.name as opponent', 'teams_totals.*')
	.join('games', 'games.team_id', 'teams.id')
	.join('teams_totals', 'teams_totals.team_id', 'teams.id')
	.join('teams as o', 'o.id', 'games.opponent_id')
	.where('games.season', parseInt(req.params.year))
	.where('teams_totals.season', parseInt(req.params.year))
	.where('teams.name', req.params.name)
	.then(function(gameLog) {
		knex('players_teams')
		.select('players_games.*', 'players.name as name', 'players.position as position', 'games.week as week')
		.join('players_games', 'players_games.players_team_id', 'players_teams.id')
		.join('players', 'players_teams.player_id', 'players.id')
		.join('games', 'players_games.game_id', 'games.id')
		.where('players_teams.team_id', gameLog[0].team_id)
		.where('players_teams.season', req.params.year)
		.then(function(playerLogs) {
			var temp = {"gameLog":gameLog, "playerLogs":playerLogs};
			console.log(playerLogs);
			res.json(temp);
		});
	});
});

module.exports = router;
