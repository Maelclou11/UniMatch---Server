const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assurez-vous que le chemin est correct

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students', // Nom de la table
      key: 'id',
    },
  },
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Businesses', // Nom de la table
      key: 'id',
    },
  },
  hasBeenDone: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
});

module.exports = Match;
