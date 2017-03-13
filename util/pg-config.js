const env = process.env;

module.exports = {
  development: {
    database: env.PG_DATABASE || 'graphfront'
  },

  production: {
    database: env.PG_DATABASE,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
  },
};
