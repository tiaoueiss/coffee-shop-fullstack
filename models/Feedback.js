const { DataTypes } = require("sequelize");
const sequelize = require("../config/sqlite.js");

const Feedback = sequelize.define("Feedback", {
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
  },
});

module.exports = Feedback;