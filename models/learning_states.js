module.exports = (sequelize, type) => sequelize.define('learningState',
  {
    learningStateId: {
      type: type.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: type.BIGINT,
      allowNull: false,
    },
    subjectId: {
      type: type.BIGINT,
      allowNull: false,
    },
    midScore: {
      type: type.INTEGER,
      allowNull: true,
    },
    numAbsent: {
      type: type.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isAllowed: {
      type: type.BOOLEAN,
      default: true,
    },
  },
  {
    underscored: true,
    timestamps: false,
    sequelize,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
