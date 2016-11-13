import db from '../server/db'
import User from '../server/db/models/user'
import Bluebird from 'bluebird'

// Unit testing libraries
import chai from 'chai'
chai.use(require('chai-things'));
chai.use(require('chai-properties'));
const expect = chai.expect;

// Express libraries
const supertest = require('supertest-as-promised');
const app = require('../server/app');
const agent = supertest.agent(app);

// Redux testing libraries
import sinon from 'sinon'
import axios from 'axios';
import { createStore } from 'redux'
import rootReducer from '../browser/react/redux/index'
import { axiosResponse } from './utils'

// Redux exports from /user
import { SET_USER,
         setUser,
         login,
         signup,
         retrieveLoggedInUser } from '../browser/react/redux/user'
import { REMOVE_USER,
         removeUser,
         logout } from '../browser/react/redux/user'

describe('User', () => {
  before('wait for the db', function(done) {
    db.didSync
      .then(() => {
        Bluebird.all([
          User.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            password: '123',
            private: false,
            profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
            location: 'Austin, TX'
          })
        ])
        .then(() => done())
        .catch(done);
      })
  });

  after('clear db', () => db.didSync)

  describe('User Model', () => {
    describe('data validation', () => {
      it('throws an error for required fields', (done) => {
        let user = User.build({
        });

        user.validate()
        .then(err => {
          expect(err).to.be.an('object');
          expect(err).to.be.an.instanceOf(Error);
          const required = ['first_name', 'last_name', 'email']
          const nullFields = [];
          err.errors.forEach(error => {
            expect(error).to.have.property('type', 'notNull Violation');
            nullFields.push(error.path);
          })
          expect(nullFields).to.have.members(required);
          done();
        })
        .catch(done);
      })

      it('throws an error for invalid profile picture url', (done) => {
        let user1 = User.build({
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
          password: '123',
          profile_pic_url: ''
        });
        let user2 = User.build({
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
          password: '123',
          profile_pic_url: 'im_not_a_url'
        });

        Bluebird.all([ user1.validate(), user2.validate()])
        .then(errs => {
          errs.forEach(err => {
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            expect(err.errors[0]).to.have.properties({
              path: 'profile_pic_url',
              type: 'Validation error'
            });
          })
          done();
        })
        .catch(done);
      })
    })

    describe('instance methods', () => {
      describe('authenticate(plaintext: String) ~> Boolean', () => {
        it('resolves true if the password matches', (done) => {
          User.findOne({where: {email: 'johndoe@example.com'}})
            .then(user => user.authenticate('123'))
            .then(result => {
              expect(result).to.be.true;
              done();
            })
            .catch(done);
        })

        it("resolves false if the password doesn't match", (done) => {
          User.findOne({where: {email: 'johndoe@example.com'}})
            .then(user => user.authenticate('blah'))
            .then(result => {
              expect(result).to.be.false;
              done();
            })
            .catch(done);
        })
      })

      describe('fullName() ~> String', () => {
        it('returns the concatenated full name', (done) => {
          User.findOne({where: {email: 'johndoe@example.com'}})
            .then(user => {
              expect(user.fullName()).to.equal('John Doe');
              done();
            })
            .catch(done);
        })
      })
    })
  })

  describe('/auth routes', () => {
    describe('POST /login', () => {
      it('responds with 200 on success', () => {
        return agent
          .post('/api/auth/login')
          .send({
            email: 'johndoe@example.com',
            password: '123'
          })
          .expect(200);
      });

      it('responds with 401 on bad user', () => {
        return agent
          .post('/api/auth/login')
          .send({
            email: 'idontexist@example.com',
            password: '123'
          })
          .expect(401)
          .then(result => {
            expect(result.res.text).to.equal('User not found');
          })
      });

      it('responds with 401 on bad password', () => {
        return agent
          .post('/api/auth/login')
          .send({
            email: 'johndoe@example.com',
            password: 'abc'
          })
          .expect(401)
          .then(result => {
            expect(result.res.text).to.equal('Incorrect password');
          })
      });
    })

    describe('POST /signup', () => {
      it('responds with 201 on creation and 200 on subsequent login', () => {
        return agent
          .post('/api/auth/signup')
          .send({
            firstName: 'Test',
            lastName: 'User',
            email: 'newuser@example.com',
            password: 'abc'
          })
          .expect(201)
          .then(res => {
            return agent.post('/api/auth/login')
            .send({
              email: 'newuser@example.com',
              password: 'abc'
            })
            .expect(200);
          });
      });

      it('responds with 500 when given invalid user', () => {
        return agent
          .post('/api/auth/signup')
          .send({
            firstName: 'Bad',
            lastName: 'User',
            email: 'thisemailsucks@example',
            password: 'abc'
          })
          .expect(500)
          .then(result => {
            expect(result.res.text).to.contain('Validation error');
          })
      });
    })

    describe('DELETE /logout', () => {
      it('responds with 204 on logout', () => {
        return agent
          .post('/api/auth/login')
          .send({
            email: 'johndoe@example.com',
            password: '123'
          })
          .expect(200)
          .then(() => {
            return agent.delete('/api/auth/logout')
              .expect(204)
              .then(logoutResult => {
                expect(logoutResult.body).to.be.empty;
                return agent.get('/api/auth/me')
                  .expect(200)
                  .then(meResult => {
                    expect(meResult.body).to.be.empty;
                  });
              });
          });
      });
    })

    describe('GET /me', () => {
      it('responds with 200 and user on success', () => {
        return agent
          .post('/api/auth/login')
          .send({
            email: 'johndoe@example.com',
            password: '123'
          })
          .expect(200)
          .then(() => {
            return agent.get('/api/auth/me')
              .expect(200)
              .then(result => {
                expect(result.body).to.have.properties({
                  first_name: 'John',
                  last_name: 'Doe'
                });
              });
          });
      });

      it('responds with empty user when unauthed', () => {
        return agent
          .delete('/api/auth/logout')
          .expect(204)
          .then(() => {
            return agent.get('/api/auth/me')
              .expect(200)
              .then(result => {
                expect(result.body).to.be.empty;
              });
          });
      });
    })
  })
  describe('Redux', () => {

    let testUser;
    beforeEach('Create test user', () => {
      testUser = {
        id: 0,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com'
      }
    });

    describe('action creators', () => {
      it(`${SET_USER} returns expected action`, () => {
        const action = setUser(testUser);
        expect(action).to.be.deep.equal({
          type: SET_USER,
          user: testUser
        });
      });

      it(`${REMOVE_USER} returns expected action`, () => {
        const action = removeUser();
        expect(action).to.be.deep.equal({
          type: REMOVE_USER
        });
      });
    });

    describe('store/reducer', () => {
      let testingStore;
      beforeEach('Create testing store from reducer', () => {
        testingStore = createStore(rootReducer);
      });

      it('has initial state of empty user object', () => {
        const currentStoreState = testingStore.getState();
        expect(currentStoreState.user).to.be.deep.equal({});
      });

      it(`reducing on ${SET_USER}`, () => {
        testingStore.dispatch(setUser(testUser));
        expect(testingStore.getState().user).to.be.deep.equal(testUser);
      });

      it(`reducing on ${REMOVE_USER}`, () => {
        testingStore.dispatch(removeUser());
        expect(testingStore.getState().user).to.be.deep.equal({});
      });

      let axiosMethod, credentials, displayErr;
      describe('thunks', () => {
        before('create reusable thunk inputs', () => {
          credentials = {
            email: 'johndoe@example.com',
            password: '123'
          };
          displayErr = (err) => {};
        })

        afterEach('Removing Function Mocks', () => {
          axios[axiosMethod].restore();
        })

        it('logging in user asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().user).to.be.deep.equal(testUser);
            done();
          }

          axiosMethod = 'post';
          let mock = sinon.mock(axios).expects(axiosMethod).once().withArgs('/api/auth/login')
            .returns(axiosResponse(testUser));
          login(credentials, displayErr)(fakeDispatch);
          mock.verify();
        });

        it('signing up user asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().user).to.be.deep.equal(testUser);
            done();
          }

          axiosMethod = 'post';
          let mock = sinon.mock(axios).expects(axiosMethod).once().withArgs('/api/auth/signup')
            .returns(axiosResponse(testUser));
          signup(credentials, displayErr)(fakeDispatch);
          mock.verify();
        });

        it('retrieving logged in user asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().user).to.be.deep.equal(testUser);
            done();
          }

          axiosMethod = 'get';
          let mock = sinon.mock(axios).expects(axiosMethod).once().withArgs('/api/auth/me')
            .returns(axiosResponse(testUser));
          retrieveLoggedInUser()(fakeDispatch);
          mock.verify();
        });

        it('log out user asynchronously', (done) => {
          const fakeDispatch = (dispatchedItem) => {
            testingStore.dispatch(dispatchedItem);
            expect(testingStore.getState().user).to.be.deep.equal({});
            done();
          }

          axiosMethod = 'delete';
          let mock = sinon.mock(axios).expects(axiosMethod).once().withArgs('/api/auth/logout')
            .returns(axiosResponse());
          logout()(fakeDispatch);
          mock.verify();
        });
      })
    });
  });
})
