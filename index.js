const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const sequelize = require('./database');
const Student = require('./models/student');
const Business = require('./models/business');
const Match = require('./models/match');
const studentRoutes = require('./routes/studentRoutes');
const businessRoutes = require('./routes/businessRoutes');
const authRoutes = require('./routes/authRoutes');
const { setupAssociations } = require('./models/modelAssociations');

// Configurer les associations
setupAssociations();

const PORT = process.env.PORT || 3001;
const apiRoot = '/api';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'  // URL du frontend
}));
app.options('*', cors());
app.use('/images', express.static(path.join(__dirname,'images')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/'); // Changez le chemin vers le dossier 'images'
  },
  filename: (req, file, cb) => {
    // Utilisez Date.now() pour obtenir un nom de fichier unique
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // Limite de taille à 25 Mo
  },
});

// Configurer les routes
const router = express.Router();

// Route des étudiants
app.use(apiRoot, studentRoutes);
// Route des entreprises
app.use(apiRoot, businessRoutes);
// Route pour se connecter
app.use(apiRoot, authRoutes);

sequelize.sync({ force: false }) // Utilisez { force: true } pour forcer la recréation des tables
  .then(() => {
    console.log('Tables synchronisées avec succès.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la synchronisation des tables :', error);
  });
