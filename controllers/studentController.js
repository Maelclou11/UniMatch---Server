const Student = require('../models/student');
const Business = require('../models/business');
const Match = require('../models/match')
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

exports.createStudent = async (req, res) => {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
  
      // Valider les données ici
          // Vérifier si l'email est déjà utilisé
    const existingStudent = await Student.findOne({ where: { email: email } });
    if (existingStudent) {
        return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
  
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Créer l'étudiant
      const student = await Student.create({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
      });
  
      res.status(201).json({ message: 'Étudiant créé', studentId: student.id });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de l'étudiant" });
      console.log("Erreur lors de la création de l'étudiant", error);
    }
  };


  exports.updateStudentProfile = async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
  
      // Gérer le téléchargement d'image
      let updatedFields = req.body;
      if (req.file) {
        const imagePath = req.file.path.replace(/^\.\/images\//, '/images/').replace(/\\/g, '/');
        updatedFields.profileImageUrl = imagePath; // Mettez à jour le champ profileImageUrl avec le chemin de l'image
      }
  
      // Mise à jour de l'étudiant avec les champs modifiés
      await student.update(updatedFields);
  
      res.status(200).json(student); // Renvoie l'objet étudiant mis à jour
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error: error.message });
    }
  };


  exports.getUserMatches = async (req, res) => {
    try {
      const studentId = req.user.userId; // Assurez-vous que l'ID de l'utilisateur est correctement extrait du token JWT

      const matches = await Match.findAll({
        where: { studentId: studentId },
        include: [{
          model: Business,
          as: 'Business',
          attributes: ['businessName', 'profileImageUrl']
        }]
      });

      res.json(matches);
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
      res.status(500).send("Erreur lors de la récupération des matchs");
    }
  };


  exports.getStudentProfile = async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await Student.findByPk(studentId, {
        attributes: ['id', 'fullName', 'profileImageUrl', 'description', 'email', 'phoneNumber', 'facebookLink', 'linkedinLink', 'instagramLink']
      });
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ message: "Étudiant non trouvé" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du profil de l'étudiant", error: error.message });
    }
  };

  exports.getAllStudents = async (req, res) => {
    try {
      const businessId = req.user.userId;
  
      // Trouver tous les studentId dans la table matches pour cette entreprise
      const matches = await Match.findAll({
        where: { businessId: businessId },
        attributes: ['studentId']
      });
  
      const matchedStudentIds = matches.map(match => match.studentId);
  
      // Exclure les étudiants déjà matchés
      const students = await Student.findAll({
        where: {
          id: { [Sequelize.Op.notIn]: matchedStudentIds }
        }
      });
  
      res.json(students);
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
      res.status(500).send("Erreur lors de la récupération des étudiants");
    }
  };
  
  exports.getStudentRanking = async (req, res) => {
    try {
      const students = await Student.findAll({
        attributes: ['id', 'fullName', 'profileImageUrl', 'score'],
        order: [['score', 'DESC']],
        limit: 10 // Optionnel: Limite le nombre d'étudiants retournés
      });
  
      res.status(200).json(students);
    } catch (error) {
      console.error("Erreur lors de la récupération du classement des étudiants:", error);
      res.status(500).send("Erreur lors de la récupération du classement des étudiants");
    }
  };
  

  