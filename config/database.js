const { Sequelize } = require('sequelize');

// Initialisez Sequelize avec SQLite (vous pouvez utiliser MySQL, PostgreSQL, etc.)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

module.exports = sequelize;
