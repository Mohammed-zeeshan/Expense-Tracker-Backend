const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('Expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: Sequelize.STRING,
    category: Sequelize.STRING,
}, {tableName: 'expense'});

module.exports = Expense;