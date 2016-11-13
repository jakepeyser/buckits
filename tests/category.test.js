import db from '../server/db'
import Category from '../server/db/models/category'
import Bluebird from 'bluebird'

// Unit testing libraries
import chai from 'chai'
chai.use(require('chai-things'))
chai.use(require('chai-properties'))
const expect = chai.expect;

// Redux testing libraries
import sinon from 'sinon'
import axios from 'axios';
import { createStore } from 'redux'
import rootReducer from '../browser/react/redux/index'
import { axiosResponse } from './utils.js'

// Redux exports from /goals
import { RETRIEVED_CATEGORIES,
         retrievedCategories,
         fetchCategories } from '../browser/react/redux/categories'

// Express libraries
const supertest = require('supertest-as-promised');
const app = require('../server/app');
const agent = supertest.agent(app);

describe('Category', () => {
  before('wait for the db', function(done) {
    db.didSync
      .then(() => {
        Bluebird.all([
          Category.create({
            category: 'Travel'
          }),
          Category.create({
            category: 'Education'
          }),
          Category.create({
            category: 'Adventure'
          })
        ])
        .then(() => done())
        .catch(done);
      })
  });

  after('clear db', () => db.didSync)

  describe('Redux', () => {
    let testCategories;
    beforeEach('Create testing store from reducer', () => {
      testCategories = new Array(3).fill().map((val, i) => {
        return { id: i, name: `Category #${i}` }
      });
    });

    describe('action creators', () => {
      it(`${RETRIEVED_CATEGORIES} returns expected action`, () => {
        const action = retrievedCategories(testCategories);
        expect(action).to.be.deep.equal({
          type: RETRIEVED_CATEGORIES,
          categories: testCategories
        });
      });
    });

    describe('store/reducer', () => {
      let testingStore;
      beforeEach('Create testing store from reducer', () => {
        testingStore = createStore(rootReducer);
      });

      it('has initial state of empty goals array', () => {
        const currentStoreState = testingStore.getState();
        expect(currentStoreState.categories).to.be.deep.equal([]);
      });

      it(`reducing on ${RETRIEVED_CATEGORIES}`, () => {
        testingStore.dispatch(retrievedCategories(testCategories));
        expect(testingStore.getState().categories).to.be.deep.equal(testCategories);
      });

      let axiosMethod;
      describe('thunks', () => {
        afterEach('Removing Function Mocks', () => {
          axios[axiosMethod].restore();
        })

        it('retrieving categories asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().categories).to.be.deep.equal(testCategories);
            done();
          }

          axiosMethod = 'get';
          let mock = sinon.mock(axios).expects('get').once().withArgs('/api/categories')
            .returns(axiosResponse(testCategories));
          fetchCategories()(fakeDispatch);
          mock.verify();
        });
      })
    });
  });

  describe('/categories routes', () => {
    describe('GET /', () => {
      it('responds with 200 and categories on success', () => {
        return agent
          .get('/api/categories')
          .expect(200)
          .then(res => {
            res.body.forEach(category => {
              expect(category).to.contain.keys(['id', 'category']);
            })
          });
      });
    })
  })
})

