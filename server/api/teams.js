var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
	knex('teams')
	.select('teams.name as team', 'games.record as record', 'teams_totals.*')
	.join('teams_totals', 'teams_totals.team_id', 'teams.id')
	.join('games', 'games.team_id', 'teams.id')
	.where('teams_totals.season',2015)
	.where('games.week',17)
	.where('games.season',2015)
	.then(function(result) {
		res.send(result);
	})
});

router.get('/:id', function(req, res, next) {
	knex.select().table('teams').where({id: req.params.id}).then(function(teams) {
		res.json(teams);
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
