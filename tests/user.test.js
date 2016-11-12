const db  = require('../server/db');
const User  = require('../server/db/models/user');
const Bluebird  = require('bluebird');

const chai  = require('chai');
chai.use(require('chai-things'));
chai.use(require('chai-properties'));
const expect = chai.expect;

const supertest = require('supertest-as-promised');
const app = require('../server/app');
const agent = supertest.agent(app);

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
})
