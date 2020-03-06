module.exports = (sequelize, type) => sequelize.define('examRegistration',
  {
    examRegistrationId: {
      type: type.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: type.BIGINT,
      allowNull: false,
    },
    examShiftId: {
      type: type.BIGINT,
      allowNull: false,
    },
  }, {
    underscored: true,
    timestamps: false,
    sequelize,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
