if (!process.env.TRAVIS_CI)
  require('dotenv').config();
process.env.NODE_ENV = 'testing';

// Run all tests
const tests = [
  'category',
  'goal',
  'user',
  'snippet'
]

tests.forEach(test => require(`./${test}.test.js`))
