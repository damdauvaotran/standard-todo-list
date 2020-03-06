module.exports = (sequelize, type) => sequelize.define('rooms',
  {
    roomId: {
      type: type.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    roomName: {
      type: type.STRING,
    },
    totalSlot: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    underscored: true,
    timestamps: false,
    sequelize,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
