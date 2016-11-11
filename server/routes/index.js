const api = require('express').Router();

api.use('/auth', require('./auth'))

module.exports = api;
