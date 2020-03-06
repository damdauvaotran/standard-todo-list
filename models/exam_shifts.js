module.exports = (sequelize, type) => sequelize.define('examShifts',
  {
    examShiftId: {
      type: type.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: type.BIGINT,
      allowNull: false,
    },
    subjectId: {
      type: type.BIGINT,
      allowNull: false,
    },
    examDate: {
      type: type.STRING,
    },
    from: {
      type: type.STRING,
    },
    // to: {
    //   type: type.STRING,
    // },
    // registered: {
    //   type: type.INTEGER,
    //   defaultValue: 0,
    // },
  }, {
    underscored: true,
    timestamps: false,
    sequelize,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
