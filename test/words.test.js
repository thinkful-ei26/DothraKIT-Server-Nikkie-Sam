'use strict';

const {app} = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY  } = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
const {words, users, oneUser } = require('../data/words');
const {User} = require('../users/models');
const expect = chai.expect;
const jwt = require('jsonwebtoken');


chai.use(chaiHttp);

describe('Noteful API - Users', function () {
  let token;
  let user;

  before(function () {
    // return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
    return dbConnect(TEST_DATABASE_URL)

      .then(() => User.deleteMany());
  });

  beforeEach(function () {
    // return User.createIndexes();
    return User.insertMany(oneUser)
      .then((user) => {
        // console.log(user);
        user = user[0];
        // console.log('the user at [0] is', user.username);
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username, expiresIn: JWT_EXPIRY });
      });
  });

  afterEach(function () {
    return User.deleteMany();
  });

  after(function () {
    return dbDisconnect();
  });

  describe('Get /word/:id', function () {

    it('should return a word as an object', function () {
      let data;
      return User.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/word/${data._id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        });
    });

    it('should return a word with correct keys', function () {
      let data;
      return User.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/word/${data._id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.all.keys('english', 'dothraki');
        });
    });

    describe('PUT /word/:id', function () {

      it('should send back correct responce keys', function () {
        const updateItem = {answer: 'it is known'};
        let data;
        return User.findOne()
          .then(_data => {
            data = _data;
            // console.log('>>>>',data);
            return chai.request(app)
              .put(`/word/${data.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(function (res) {
            // console.log('>>>>>',res.body)
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object'); 
            expect(res.body).to.include.keys('answerCorrect', 'individualWordScore');
            
          });
      });


    //   it.only('should send back correct res with correct answer', function () {
    //     const updateItem = {answer: 'it is known'};
    //     let data;
    //     return User.findOne()
    //       .then(_data => {
    //         data = _data;
    //         // console.log('>>>>',data);
    //         return chai.request(app)
    //           .put(`/word/${data.id}`)
    //           .set('Authorization', `Bearer ${token}`)
    //           .send(updateItem);
    //       })
    //       .then(function (res) {
    //         console.log('>>>>>',data)
    //         expect(res).to.have.status(200);
    //         expect(res).to.be.json;
    //         expect(res.body).to.be.a('object');
    //         expect(res.body).to.include.keys('answerCorrect', 'individualWordScore');
    //         expect(res.body.answerCorrect).to.equal(data);
        
    //       });
    //   });
    
    
    
    });   

  });

});