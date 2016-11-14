const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('bucket', {
  status: {
    type: DataTypes.ENUM(),
    values: ['in_progress', 'bailed', 'completed'],
    defaultValue: 'in_progress'
  }
});
