var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
	knex('players')
	.select('players.name as name', 'players.position as position', 'teams.name as team', 'players_totals.*')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.join('players_totals', 'players_totals.players_team_id', 'players_teams.id')
	.where('season',2016)
	.then(function(result) {
		res.send(result);
	})
});

router.get('/:year', function(req, res, next) {
	knex('players')
	.select('players.name as name', 'players.position as position', 'teams.name as team', 'players_teams.season as season', 'players_totals.*')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.join('players_totals', 'players_totals.players_team_id', 'players_teams.id')
	.where('season',req.params.year)
	.then(function(result) {
		res.send(result);
	})
});

router.get('/:year/:name', function(req, res, next) {
	knex('players')
	.select('players.name as name', 'players.position as position', 'players.age as age', 'teams.name as team', 'teams.city as city', 'players.id as player_id', 'teams.id as team_id', 'players_teams.id as players_team_id')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.where('players_teams.season', req.params.year)
	.where('players.name',req.params.name)
	.then(function(players) {
		knex('players_games')
		.select('players_games.*', 'games.week as week', 't.name', 'games.id as game_id', 'games.home as home', 'o.name as opponent')
		.join('games', 'players_games.game_id', 'games.id')
		.join('teams as t', 't.id', 'games.team_id')
		.join('teams as o', 'o.id', 'games.opponent_id')
		.where('players_games.players_team_id', players[0].players_team_id)
		.where('games.team_id', players[0].team_id)
		.where('games.season', req.params.year)
		.then(function(playerData) {
			var temp = {"playerInfo":players, "playerLog":playerData}
			res.json(temp);
		});
	});
});


module.exports = router;
