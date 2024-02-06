const Business = require('../models/business');
const Match = require('../models/match'); // Assurez-vous d'importer le modèle Match
const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

exports.createBusiness = async (req, res) => {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
  
      // Valider les données ici
      // Vérifier si l'email est déjà utilisé
      const existingbusiness = await Business.findOne({ where: { email: email } });
      if (existingbusiness) {
          return res.status(409).json({ message: "Cet email est déjà utilisé." });
      }
  
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Générer un code PIN unique
      let pinCode;
      let isUnique = false;
      while (!isUnique) {
          pinCode = Math.floor(10000 + Math.random() * 90000); // Génère un nombre entre 10000 et 99999
          const existingPin = await Business.findOne({ where: { pinCode: pinCode } });
          if (!existingPin) {
              isUnique = true;
          }
      }
  
      // Créer la business
      const business = await Business.create({
        businessName: fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        pinCode: pinCode,
      });
  
      res.status(201).json({ message: 'Étudiant créé', businessId: business.id });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de l'entreprise" });
      console.log("Erreur lors de la création de l'entreprise", error);
    }
  };


  exports.updateBusinessProfile = async (req, res) => {
    try {
      const { businessId } = req.params;
      const business = await Business.findByPk(businessId);
      if (!business) {
        return res.status(404).json({ message: "Entreprise non trouvé" });
      }
  
      // Gérer le téléchargement d'image
      let updatedFields = req.body;
      if (req.file) {
        const imagePath = req.file.path.replace(/^\.\/images\//, '/images/').replace(/\\/g, '/');
        updatedFields.profileImageUrl = imagePath; // Ajoutez ou mettez à jour le champ d'image
      }
  
      // Mise à jour de l'entreprise avec les champs modifiés
      await business.update(updatedFields);
  
      res.status(200).json(business);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error: error.message });
    }
  };

  exports.getAllBusiness = async (req, res) => {
    try {
      const studentId = req.user.userId;
  
      // Trouver tous les businessId dans la table matches pour cet étudiant
      const matches = await Match.findAll({
        where: { studentId: studentId },
        attributes: ['businessId']
      });

      // Utilisez .map() sur le tableau résolu pour extraire les businessId
      const matchedBusinessIds = matches.map(match => match.businessId);

      // Utiliser `findAll` avec l'option `where` pour exclure les entreprises matchées
      const businesses = await Business.findAll({
        where: {
          id: { [Sequelize.Op.notIn]: matchedBusinessIds } // Exclure les entreprises matchées
        }
      });
  
      res.json(businesses);
    } catch (error) {
      console.error("Erreur lors de la récupération des entreprises:", error);
      res.status(500).send("Erreur lors de la récupération des entreprises");
    }
  };

  exports.createMatch = async (req, res) => {
    try {
        const { studentId, businessId } = req.body; // Recevez l'ID de l'étudiant et de l'entreprise depuis le corps de la requête

        // Assurez-vous que l'étudiant et l'entreprise existent
        const student = await Student.findByPk(studentId);
        const business = await Business.findByPk(businessId);

        if (!student) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        if (!business) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }

        // Créer une entrée dans la table matches
        const match = await Match.create({
            studentId: studentId,
            businessId: businessId,
            hasBeenDone: false,
            status: 'pending',
        });

        // Ajouter +1 point de score au Student
        await student.increment('score', { by: 1 });

        res.status(200).json({ match: true, message: "Match créé avec succès", match });
    } catch (error) {
        console.error("Erreur lors de la création du match:", error);
        res.status(500).send("Erreur lors de la création du match");
    }
  };

  exports.getBusinessProfile = async (req, res) => {
    try {
      const { businessId } = req.params;
      const business = await Business.findByPk(businessId, {
        attributes: ['id', 'businessName', 'profileImageUrl', 'description', 'email', 'phoneNumber', 'facebookLink', 'linkedinLink', 'instagramLink']
      });
      if (business) {
        res.status(200).json(business);
      } else {
        res.status(404).json({ message: "Entreprise non trouvée" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du profil de l'entreprise", error: error.message });
    }
  };
  

  exports.getMatchedStudents = async (req, res) => {
    const businessId = req.user.userId; // Assurez-vous que l'ID de l'entreprise est correctement extrait du token JWT

    try {
        const matches = await Match.findAll({
            where: { businessId: businessId }, // ou un autre statut selon vos besoins
            include: [{
                model: Student,
                as: 'Student',
                attributes: ['id', 'fullName', 'profileImageUrl', 'Role', 'description']
            }]
        });

        res.status(200).json(matches);
    } catch (error) {
        console.error("Erreur lors de la récupération des étudiants matchés:", error);
        res.status(500).send("Erreur lors de la récupération des étudiants matchés");
    }
  };

  exports.updateMatchStatus = async (req, res) => {
    try {
      const { matchId } = req.params;
      const { status } = req.body; // 'in interview', 'accepted', ou 'refused'
  
      const match = await Match.findByPk(matchId, {
        include: [{
          model: Student,
          as: 'Student' // Assurez-vous que cette association est correctement définie dans vos modèles
        }]
      });
  
      if (!match) {
        return res.status(404).json({ message: "Match non trouvé." });
      }
  
      await match.update({ status });
  
      // Si le match est accepté, augmentez le score de l'étudiant
      if (status === 'accepted' && match.Student) {
        await match.Student.increment('score', { by: 5 });
      }
  
      res.status(200).json({ message: "Statut du match mis à jour avec succès." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du match:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut du match.", error: error.message });
    }
  };