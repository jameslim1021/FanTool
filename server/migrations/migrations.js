
exports.up = function(knex, Promise) {
  return Promise.all([

      knex.schema.createTable('players',function(table){
          table.increments('id').primary();
          table.string('name').notNullable();
          table.string('position');
          table.biginteger('age'); //added
      })]).then(function(){

        return knex.schema.createTable('teams',function (table) {
          table.increments('id').primary();
          table.string('city');
          table.string('name');
        });
      }).then(function() {

        return knex.schema.createTable('teams_totals',function(table){
            table.increments('id').primary();
            table.biginteger('team_id',20).references('id').inTable('teams').onDelete('cascade');
            table.biginteger('season');
            table.biginteger('points');
            table.biginteger('total_yards');
            table.biginteger('turnovers');
            table.biginteger('completions');
            table.biginteger('attempts');
            table.biginteger('pass_yards');
            table.biginteger('pass_tds');
            table.biginteger('interceptions');
            table.biginteger('carries');
            table.biginteger('rush_yards');
            table.biginteger('rush_tds');
        });
      }).then(function() {

        return knex.schema.createTable('games',function(table){
            table.increments('id').primary();
            table.biginteger('team_id',20).references('id').inTable('teams').onDelete('cascade');
            table.biginteger('opponent_id',20).references('id').inTable('teams').onDelete('cascade');
            table.biginteger('season');
            table.biginteger('week');
            table.string('result');
            table.string('record');
            table.boolean('home');
            table.biginteger('points_for');
            table.biginteger('points_against');
            table.biginteger('total_yards_for');
            table.biginteger('pass_yards_for');
            table.biginteger('rush_yards_for');
            table.biginteger('turnovers_lost');
            table.biginteger('total_yards_against');
            table.biginteger('pass_yards_against');
            table.biginteger('rush_yards_against');
            table.biginteger('turnovers_forced');
        });
      }).then(function(){

        return knex.schema.createTable('players_teams',function (table) {
            table.increments('id').primary();
            table.biginteger('player_id',20).references('id').inTable('players').onDelete('cascade');
            table.biginteger('team_id',20).references('id').inTable('teams').onDelete('cascade');
            table.biginteger('season');
        });
      }).then(function () {

        return knex.schema.createTable('players_totals',function (table) {
            table.increments('id').primary();
            table.biginteger('players_team_id',20).references('id').inTable('players').onDelete('cascade');
            table.biginteger('games_played');
            table.biginteger('games_started');
            table.biginteger('completions');
            table.biginteger('attempts');
            table.biginteger('pass_tds');
            table.biginteger('interceptions');
            table.biginteger('pass_yards');
            table.biginteger('carries');
            table.biginteger('rush_yards');
            table.biginteger('rush_tds');
            table.biginteger('targets');
            table.biginteger('receptions');
            table.biginteger('rec_yards');
            table.biginteger('rec_tds');
        });
      }).then(function () {

        return knex.schema.createTable('players_games',function (table) {
            table.increments('id').primary();
            table.biginteger('players_team_id',20).references('id').inTable('players_teams').onDelete('cascade');
            table.biginteger('game_id',20).references('id').inTable('games').onDelete('cascade');
            table.biginteger('completions');
            table.biginteger('attempts');
            table.biginteger('pass_tds');
            table.biginteger('interceptions');
            table.biginteger('pass_yards');
            table.biginteger('times_sacked');
            table.biginteger('pass_long');
            table.biginteger('carries');
            table.biginteger('rush_yards');
            table.biginteger('rush_tds');
            table.biginteger('rush_long');
            table.biginteger('targets');
            table.biginteger('receptions');
            table.biginteger('rec_yards');
            table.biginteger('rec_tds');
            table.biginteger('rec_long');
            table.biginteger('fumbles');
            table.biginteger('fumbles_lost');
        });
    });
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('players'),
      knex.schema.dropTable('teams'),
      knex.schema.dropTable('teams_totals'),
      knex.schema.dropTable('games'),
      knex.schema.dropTable('players_teams'),
      knex.schema.dropTable('players_totals'),
      knex.schema.dropTable('players_games')
  ]);
};
