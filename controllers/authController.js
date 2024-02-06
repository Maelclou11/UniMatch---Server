const bcrypt = require('bcryptjs');
const Student = require('../models/student');
const Business = require('../models/business');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Chercher dans la table Student
    let user = await Student.findOne({ where: { email: email } });
    let userType = 'student';

    // Si non trouvé, chercher dans la table Business
    if (!user) {
      user = await Business.findOne({ where: { email: email } });
      userType = 'business';
    }

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Password from request:", password);
        console.log("Hashed password from DB:", user.password);
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // Si la vérification est réussie, générer un token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: userType },
      process.env.TOKEN_SECRET, // Utilisez une chaîne secrète complexe ici
      { expiresIn: '24h' } // Le token expire après 24 heures
    );

    // Renvoyer le token dans la réponse
    res.status(200).json({ token: token, userType: userType, userId:  user.id });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};


exports.getProfilData = async (req, res) => {
  try {
    const { userId, userType } = req.user; // Récupéré du middleware

    let userData;
    if (userType === 'student') {
      userData = await Student.findByPk(userId);
    } else if (userType === 'business') {
      userData = await Business.findByPk(userId);
    }

    if (!userData) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    console.log("USER DATA :", userData);

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des données de l'utilisateur." });
  }
};