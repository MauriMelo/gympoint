require('../bootstrap');

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  storage: './__tests__/database.sqlite',
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
