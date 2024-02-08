require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("heroku_87676e5496b8cda", "b11ce13101e615", "5259a87c", {
  host: "us-cluster-east-01.k8s.cleardb.net",
  dialect: 'mysql',
});
module.exports = sequelize;

// Si l'on veux voir si le résultat de la connexion 
async function testConnection() {
    try {
     await sequelize.authenticate();
     console.log('Connection to the database has been established successfully.');
    } catch (error) {
     console.error('Unable to connect to the database:', error);
    }
}
testConnection();

// Sert à créer la base de donnée ou bien la synchroniser
sequelize.sync({ alter: true }) // Utilisez { force: true } pour recréer les tables (attention, cela supprime les données existantes)
  .then(() => {
    console.log('Database tables have been synchronized.');
  })
  .catch((error) => {
    console.error('Error synchronizing the database tables:', error);
  });