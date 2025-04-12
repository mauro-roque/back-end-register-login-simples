const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("proj_spectra", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3307
});

module.exports = sequelize;
