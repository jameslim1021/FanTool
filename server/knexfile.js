// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection:'postgres://localhost:5432/nfl_stats',
    debug:true

  },

  staging:{
    client:'pg',
    connection: process.env.DATABASE_URL
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 15
    }
  }

};
