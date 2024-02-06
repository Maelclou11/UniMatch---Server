const express = require('express');
const businessController = require('../controllers/businessController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

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

// route pour créer une business
router.post('/signup/business', businessController.createBusiness);

// route pour modifier le profile d'une business
router.put('/business/:businessId', upload.single('profileImage'), businessController.updateBusinessProfile);

// route pour avoir tous les business
router.get('/businesses', authMiddleware, businessController.getAllBusiness);

// route pour ajouter un entreprise a ses entreprise enregistré
router.post('/matches', authMiddleware, businessController.createMatch);

// route pour voir le profil de l'entreprise
router.get('/business/:businessId', authMiddleware, businessController.getBusinessProfile);

// route pour avoir tous les etudiants qui ont matché avec cette entreprise
router.get('/businesses/matchedStudents', authMiddleware, businessController.getMatchedStudents);

// route pour update le status d'un match
router.put('/matches/:matchId/status', authMiddleware, businessController.updateMatchStatus);




module.exports = router;
