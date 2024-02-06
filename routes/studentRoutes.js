const express = require('express');
const studentController = require('../controllers/studentController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');


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

const router = express.Router();

// route pour créer un étudiant
router.post('/signup/student', studentController.createStudent);

// route pour modifier le profile d'un étudiant
router.put('/student/:studentId', upload.single('profileImage'), studentController.updateStudentProfile);

// route pour voir les matchs d'un etudiant
router.get('/matches', authMiddleware, studentController.getUserMatches)

// route pour voir le profil d'un etudiant 
router.get('/student/:studentId', authMiddleware ,studentController.getStudentProfile);

// route pour avoir tous les etudiants qui ne sont pas match
router.get('/students', authMiddleware,  studentController.getAllStudents);

// route pour avoir le classement des scores
router.get('/students/ranking', studentController.getStudentRanking);


module.exports = router;
