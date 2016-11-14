const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('picture', {
  picture_url: {
    type: DataTypes.STRING(),
    validate: {
      notEmpty: true,
      isUrl: true
    }
  }
});
