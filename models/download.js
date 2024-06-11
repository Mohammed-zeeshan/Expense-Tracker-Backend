const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Download = sequelize.define('Download', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    link: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileName: Sequelize.STRING
}, {tableName: 'download'});

module.exports = Download;