const Sequelize = require('sequelize');
const UserModel = require('./users');
const SubjectModel = require('./subjects');
const ExamRegistrationModel = require('./exam_registration');
const ExamShiftModel = require('./exam_shifts');
const LearningStateModel = require('./learning_states');
const RoomModel = require('./rooms');
const SemesterModel = require('./semester');

const DATABASE_NAME = process.env.DATABASE_NAME || 'math_app';
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'root';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '12345678';


const db = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const Users = UserModel(db, Sequelize);
const Subjects = SubjectModel(db, Sequelize);
const ExamRegistrations = ExamRegistrationModel(db, Sequelize);
const ExamShifts = ExamShiftModel(db, Sequelize);
const LearningStates = LearningStateModel(db, Sequelize);
const Rooms = RoomModel(db, Sequelize);
const Semesters = SemesterModel(db, Sequelize);

Users.hasMany(LearningStates, { foreignKey: 'userId' });
LearningStates.belongsTo(Users, { foreignKey: 'userId' });

Subjects.hasMany(LearningStates, { foreignKey: 'subjectId' });
LearningStates.belongsTo(Subjects, { foreignKey: 'subjectId' });

Subjects.hasMany(ExamShifts, { foreignKey: 'subjectId' });
ExamShifts.belongsTo(Subjects, { foreignKey: 'subjectId' });

Rooms.hasMany(ExamShifts, { foreignKey: 'roomId' });
ExamShifts.belongsTo(Rooms, { foreignKey: 'roomId' });

ExamShifts.hasMany(ExamRegistrations, { foreignKey: 'examShiftId' });
ExamRegistrations.belongsTo(ExamShifts, { foreignKey: 'examShiftId' });

Users.hasMany(ExamRegistrations, { foreignKey: 'userId' });
ExamRegistrations.belongsTo(Users, { foreignKey: 'userId' });

Semesters.hasMany(ExamShifts, { foreignKey: 'semesterId' });
ExamShifts.belongsTo(Semesters, { foreignKey: 'semesterId' });


db.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = {
  Users, Subjects, ExamRegistrations, ExamShifts, LearningStates, Rooms, Semesters,
};
