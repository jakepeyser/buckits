const db = require('../db');
const Category = db.model('category');
const router = require('express').Router();

// --------------------> '/auth/' <-----------------------

// Retrieve all categories
router.get('/', (req, res, next) => {
  Category.findAll({ attributes: ['id', 'category', 'action'] })
  .then(categories => res.send(categories))
  .catch(next);
});

module.exports = router;
