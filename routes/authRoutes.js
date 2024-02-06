const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);

// route pour recevoir tous les informations d'un user
router.get('/user/profile', authMiddleware, authController.getProfilData);

module.exports = router;
