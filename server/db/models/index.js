const Goal = require('./goal');
const User = require('./user');
const Category = require('./category');
const Tag = require('./tag');
const Snippet = require('./snippet');
const Bucket = require('./bucket');
const Picture = require('./picture');
const Story = require('./story');

// Form the associations
Goal.belongsTo(Category);
Goal.hasMany(Snippet);
Goal.belongsToMany(Tag, { through: 'goalTag' });
Tag.belongsToMany(Goal, { through: 'goalTag' });
Goal.belongsToMany(User, { through: 'like' });
User.belongsToMany(Goal, { through: 'like' });
Goal.hasMany(Bucket);
Bucket.hasMany(Picture);
Bucket.belongsToMany(User, { through: 'fellowship' });
Bucket.hasMany(Story);
User.hasMany(Story);

module.exports = {
  Goal,
  User,
  Category,
  Tag,
  Snippet,
  Bucket,
  Picture,
  Story
};
