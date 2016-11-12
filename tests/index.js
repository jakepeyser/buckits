require('dotenv').config();
process.env.NODE_ENV = 'testing';

// Run all tests
const tests = [
  'goal',
  'user',
  'snippet'
]

tests.forEach(test => require(`./${test}.test.js`))
