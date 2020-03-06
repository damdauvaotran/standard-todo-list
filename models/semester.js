module.exports = (sequelize, type) => sequelize.define('semester',
  {
    semesterId: {
      type: type.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    semesterName: {
      type: type.STRING,
    },
    isActive: {
      type: type.BOOLEAN,
      defaultValue: true,
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
