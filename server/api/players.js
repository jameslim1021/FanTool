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
	.select('players.name as name', 'players.position as position', 'teams.name as team', 'players_totals.*')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.join('players_totals', 'players_totals.players_team_id', 'players_teams.id')
	.where('season',req.params.year)
	.then(function(result) {
		res.send(result);
	})
});

router.get('/:year/:id', function(req, res, next) {
	knex('players')
	.select('players.name as name', 'players.position as position', 'teams.name as team')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.where('players_teams.season',req.params.year)
	.where('players.id',req.params.id)
	.then(function(players) {
		console.log(players, 'ASFAFDSA')
		res.json(players);
	});
});


module.exports = router;
