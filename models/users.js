module.exports = (sequelize, type) => sequelize.define('users',
  {
    userId: {
      type: type.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      type: type.STRING,
      allowNull: false,
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    role: {
      type: type.INTEGER,
      allowNull: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    mssv: {
      type: type.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: type.DATE,
    },
    city: {
      type: type.STRING,
    },
    country: {
      type: type.STRING,
    },
    createDate: {
      type: type.DATE,
    },
    lastUpdate: {
      type: type.DATE,
    },
  },
  {
    underscored: true,
    timestamps: false,
    sequelize,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
