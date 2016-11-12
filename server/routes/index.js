const api = require('express').Router();

api.use('/auth', require('./auth'))
api.use('/goals', require('./goals'))

module.exports = api;
