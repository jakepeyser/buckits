const db = require('../db');
const Goal = db.model('goal');
const User = db.model('user');
const router = require('express').Router();

// --------------------> '/auth/' <-----------------------

// Retrieve all goals
router.get('/', (req, res, next) => {
  // Allow queries on category
  const where = {};
  if (req.query.category) where.category_id = Number(req.query.category)

  // Find all goals and their associated 'likes'
  Goal.findAll({
    where,
    include: [{ model: User, attributes: ['id'] }]
  })
  .then(goals => {
    // Calculate the likes and remove associated users
    goals.forEach(goal => {
      goal.dataValues.likes = goal.users.length;
      delete goal.dataValues.users;
    })
    res.send(goals)
  })
  .catch(next);
});

module.exports = router;
