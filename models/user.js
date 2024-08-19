const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = UserModel;