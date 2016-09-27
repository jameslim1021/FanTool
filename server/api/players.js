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

router.get('/:year/:name', function(req, res, next) {
	knex('players')
	.select('players.name as name', 'players.position as position', 'teams.name as team', 'teams.city as city', 'players.id as player_id', 'teams.id as team_id', 'players_teams.id as players_team_id')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.where('players_teams.season', '2015')
	.where('players.name',req.params.name)
	.then(function(players) {
		console.log(players[0].players_team_id)
		knex('games')
		.select('players_games.carries as carries', 'games.opponent_id', 'games.team_id')
		.join('players_games', 'players_games.game_id', 'games.id')
		.join('players_teams', 'players_teams.id', 'players_games.players_team_id')
		.where('players_games.players_team_id', players[0].players_team_id)
		.where('games.team_id', players[0].team_id)
		.then(function(playerData) {
			res.json(playerData);
		})
		// res.json(players);
	});
	// knex('players')
	// .select('players_games.*')
	// .join('players_teams', 'players_teams.player_id', 'players.id')
	// .join('teams', 'players_teams.team_id', 'teams.id')
	// .join('games', 'games.team_id', 'players_teams.team_id')
	// .join('players_games', 'games.id', 'players_games.game_id')
	// .where('players_teams.season', '2015')
	// .where('games.season', '2015')
	// .where('players.name',req.params.name)
	// .then(function(players) {
	// 	console.log(players, 'SERVER')
	// 	res.json(players);
	// });
});


module.exports = router;
