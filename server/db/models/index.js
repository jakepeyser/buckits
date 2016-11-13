const Goal = require('./goal');
const User = require('./user');
const Category = require('./category');
const Tag = require('./tag');
const Snippet = require('./snippet');

// Form the associations
Goal.belongsTo(Category);
Goal.hasMany(Snippet);
Goal.belongsToMany(Tag, { through: 'goalTag' });
Tag.belongsToMany(Goal, { through: 'goalTag' });
Goal.belongsToMany(User, { through: 'like' });
User.belongsToMany(Goal, { through: 'like' });

module.exports = {
  Goal,
  User,
  Category,
  Tag,
  Snippet
};
