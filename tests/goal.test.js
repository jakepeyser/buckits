import db from '../server/db'
import Goal from '../server/db/models/goal'
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
import { RETRIEVED_GOALS,
         retrievedGoals,
         fetchGoals } from '../browser/react/redux/goals'
import { RETRIEVED_GOAL,
         retrievedGoal,
         fetchGoal } from '../browser/react/redux/goal'

describe('Goal', () => {
  before('wait for the db', function(done) {
    db.didSync
      .then(() => {
        Bluebird.all([
          Goal.create({
            name: 'Test Goal 1'
          }),
          Goal.create({
            name: 'Test Goal 2'
          }),
          Goal.create({
            name: 'Test Goal 3'
          })
        ])
        .then(() => done())
        .catch(done);
      })
  });

  after('clear db', () => db.didSync)
  describe('Goal Model', () => {
    describe('data validation', () => {
      it('throws an error for invalid name', (done) => {
        let goal = Goal.build({
        });

        goal.validate()
        .then(err => {
          expect(err).to.be.an('object');
          expect(err).to.be.an.instanceOf(Error);
          expect(err.errors[0]).to.have.properties({
            path: 'name',
            type: 'notNull Violation'
          });
          done();
        })
        .catch(done);
      })

      it('throws an error for invalid price ranges', (done) => {
        let goal1 = Goal.build({
          name: 'Price Range Too Low',
          price_range: 0
        });
        let goal2 = Goal.build({
          name: 'Price Range Too High',
          price_range: 5
        });

        Bluebird.all([ goal1.validate(), goal2.validate()])
        .then(errs => {
          errs.forEach(err => {
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            expect(err.errors[0]).to.have.properties({
              path: 'price_range',
              type: 'Validation error'
            });
          })
          done();
        })
        .catch(done);
      })

      it('throws errors for invalid lat/lon', (done) => {
        let goal1 = Goal.build({
          name: 'Lat/Lon Too Low',
          lat: -91,
          lon: -181
        });
        let goal2 = Goal.build({
          name: 'Lat/Lon Too High',
          lat: 91,
          lon: 181
        });

        Bluebird.all([ goal1.validate(), goal2.validate()])
        .then(errs => {
          errs.forEach(err => {
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            expect(err.errors[0]).to.have.properties({
              path: 'lat',
              type: 'Validation error'
            });
            expect(err.errors[1]).to.have.properties({
              path: 'lon',
              type: 'Validation error'
            });
          })
          done();
        })
        .catch(done);
      })

      it('throws an error for invalid banner picture url', (done) => {
        let goal1 = Goal.build({
          name: 'Test Goal 1',
          banner_pic_url: ''
        });
        let goal2 = Goal.build({
          name: 'Test Goal 2',
          banner_pic_url: 'im_not_valid'
        });

        Bluebird.all([ goal1.validate(), goal2.validate()])
        .then(errs => {
          errs.forEach(err => {
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            expect(err.errors[0]).to.have.properties({
              path: 'banner_pic_url',
              type: 'Validation error'
            });
          })
          done();
        })
        .catch(done);
      })

      it('throws an error for invalid banner picture url', (done) => {
        let goal1 = Goal.build({
          name: 'Test Goal 1',
          banner_pic_url: ''
        });
        let goal2 = Goal.build({
          name: 'Test Goal 2',
          banner_pic_url: 'im_not_valid'
        });

        Bluebird.all([ goal1.validate(), goal2.validate()])
        .then(errs => {
          errs.forEach(err => {
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            expect(err.errors[0]).to.have.properties({
              path: 'banner_pic_url',
              type: 'Validation error'
            });
          })
          done();
        })
        .catch(done);
      })
    })
  })
  describe('Redux', () => {

    let testGoals;
    let curGoal;
    beforeEach('Create testing store from reducer', () => {
      testGoals = new Array(3).fill().map((val, i) => {
        return { id: i, name: `Product #${i}` }
      });
      let snippets = [{ goal_id: testGoals[0].id, title: 'Overview', description: 'This is a test' }];
      curGoal = Object.assign(snippets, testGoals[0]);
    });

    describe('action creators', () => {
      it(`${RETRIEVED_GOALS} returns expected action`, () => {
        const action = retrievedGoals(testGoals);
        expect(action).to.be.deep.equal({
          type: RETRIEVED_GOALS,
          goals: testGoals
        });
      });

      it(`${RETRIEVED_GOAL} returns expected action`, () => {
        const action = retrievedGoal(curGoal);
        expect(action).to.be.deep.equal({
          type: RETRIEVED_GOAL,
          goal: curGoal
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
        expect(currentStoreState.goals).to.be.deep.equal([]);
      });

      it('has initial state of empty current goal object', () => {
        const currentStoreState = testingStore.getState();
        expect(currentStoreState.currentGoal).to.be.deep.equal({});
      });

      it(`reducing on ${RETRIEVED_GOALS}`, () => {
        testingStore.dispatch(retrievedGoals(testGoals));
        expect(testingStore.getState().goals).to.be.deep.equal(testGoals);
      });

      it(`reducing on ${RETRIEVED_GOAL}`, () => {
        testingStore.dispatch(retrievedGoal(curGoal));
        expect(testingStore.getState().currentGoal).to.be.deep.equal(curGoal);
      });

      let axiosMethod;
      describe('thunks', () => {
        afterEach('Removing Function Mocks', () => {
          axios[axiosMethod].restore();
        })

        it('retrieving goals asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().goals).to.be.deep.equal(testGoals);
            done();
          }

          axiosMethod = 'get';
          let mock = sinon.mock(axios).expects('get').once().withArgs('/api/goals?')
            .returns(axiosResponse(testGoals));
          fetchGoals()(fakeDispatch);
          mock.verify();
        });

        it('retrieving a single goal asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().currentGoal).to.be.equal(curGoal);
            done();
          }

          axiosMethod = 'get';
          let mock = sinon.mock(axios).expects('get').once()// .withArgs('/api/goal/0')
            .returns(axiosResponse(curGoal));
          fetchGoal(curGoal.id)(fakeDispatch);
          mock.verify();
        });
      })
    });
  });
})

