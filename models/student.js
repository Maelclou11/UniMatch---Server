const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assurez-vous que le chemin vers votre connexion à la base de données est correct


const Student = sequelize.define('Student', {
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Mettez à false si vous voulez que le champ soit obligatoire
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  Role: {
    type: DataTypes.STRING,
    defaultValue: "Étudiant à l'université Laval"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
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
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
  
module.exports = Student;
