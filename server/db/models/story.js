const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('story', {
  title: {
    type: DataTypes.STRING(),
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER(),
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: DataTypes.TEXT()
});
