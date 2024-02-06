const Student = require('./student');
const Business = require('./business');
const Match = require('./match');

function setupAssociations() {
    // Association entre Match et Student
    Match.belongsTo(Student, { foreignKey: 'studentId' });
    Student.hasMany(Match, { foreignKey: 'studentId' });

    // Association entre Match et Business
    Match.belongsTo(Business, { foreignKey: 'businessId' });
    Business.hasMany(Match, { foreignKey: 'businessId' });
}

module.exports = { setupAssociations };