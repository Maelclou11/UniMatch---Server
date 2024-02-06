require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
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