var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/players', function(req, res, next) {
	knex.select().table('players').then(function(players) {
		res.json(players);
	});
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
