var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
	knex('players')
	.select('players.name as name', 'teams.name as team', 'players_totals.*')
	.join('players_teams', 'players_teams.player_id', 'players.id')
	.join('teams', 'players_teams.team_id', 'teams.id')
	.join('players_totals', 'players_totals.players_team_id', 'players_teams.id')
	.where('season',2015)
	.then(function(result) {
		res.send(result);
	})
});

router.get('/players/:id', function(req, res, next) {
	knex.select().table('players').where({id: req.params.id}).then(function(players) {
		res.json(players);
	});
});

// router.post('/', function(req, res, next) {
// 	knex('players').insert(req.body).then(function(insert) {
// 		knex.select().table('players').then(function(players) {
// 			res.json(players);
// 		});
// 	});
// });
//
// router.put("/:id", function(req, res, next) {
// 	knex('players').update(req.body).where({"id" : req.params.id}).then(function(insert) {
// 		knex.select().table('players').then(function(players) {
// 			res.json(players);
// 		});
// 	});
// }).delete(function(req, res, next) {
// 	knex('players').where({"id":req.params.id}).del();
// });

module.exports = router;
