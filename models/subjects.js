module.exports = (sequelize, type) => sequelize.define('subjects',
  {
    subjectId: {
      type: type.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    subjectName: {
      type: type.STRING,
      allowNull: false,
    },
    subjectCredit: {
      type: type.INTEGER,
      allowNull: false,
    },
  },
  {
    underscored: true,
    timestamps: false,
    sequelize,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
