const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    discordId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'en'
    },
    messageCount:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = User;
