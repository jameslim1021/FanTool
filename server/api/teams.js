var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/teams', function(req, res, next) {
	knex.select().table('teams').then(function(teams) {
		res.json(teams);
	});
});

router.get('/teams/:id', function(req, res, next) {
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
