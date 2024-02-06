const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assurez-vous que le chemin vers votre connexion à la base de données est correct

const Business = sequelize.define('Business', {
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Mettez à false si vous voulez que le champ soit obligatoire
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pinCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  Role: {
    type: DataTypes.STRING,
    defaultValue: "Type d'entreprise"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Mettez à false si le numéro de téléphone est obligatoire
  },
  facebookLink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  linkedinLink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  instagramLink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Business;



