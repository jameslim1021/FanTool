var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
	knex('teams')
	.select('teams.name as team', 'games.record as record', 'teams_totals.*')
	.join('teams_totals', 'teams_totals.team_id', 'teams.id')
	.join('games', 'games.team_id', 'teams.id')
	.where('teams_totals.season',2016)
	.where('games.week',3)
	.where('games.season',2016)
	.then(function(result) {
		console.log('/teams')
		res.send(result);
	});
});

router.get('/:year', function(req, res, next) {
	knex('teams')
	.select('teams.name as team', 'games.record as record', 'teams_totals.*')
	.join('teams_totals', 'teams_totals.team_id', 'teams.id')
	.join('games', 'games.team_id', 'teams.id')
	.where('teams_totals.season', parseInt(req.params.year))
	.where('games.week',17)
	.where('games.season', parseInt(req.params.year))
	.then(function(result) {
		console.log('/teams/:year')
		res.send(result);
	});
});

// router.post('/', function(req, res, next) {
// 	knex('teams').insert(req.body).then(function(insert) {
// 		knex.select().table('teams').then(function(teams) {
// 			res.json(teams);
// 		});
// 	});
// });
//
// router.put("/:id", function(req, res, next) {
// 	knex('teams').update(req.body).where({"id" : req.params.id}).then(function(insert) {
// 		knex.select().table('teams').then(function(teams) {
// 			res.json(teams);
// 		});
// 	});
// }).delete(function(req, res, next) {
// 	knex('teams').where({"id":req.params.id}).del();
// });

module.exports = router;
