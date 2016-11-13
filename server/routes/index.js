const api = require('express').Router();

api.use('/auth', require('./auth'))
api.use('/categories', require('./categories'))
api.use('/goals', require('./goals'))

module.exports = api;
