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

      it.only('should send back correct responce keys', function () {
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


      it('should send back corrent responce keys', function () {
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
            expect(data.words[0].answerCorrect).to.equal(true);
        
          });
      });
    
      it('should update the note when provided valid content', function () {
        const updateItem = {
          content: 'Lorem ipsum dolor sit amet...',
        };
        let data;
        return Note.findOne({userId: user.id})
          .then(_data => {
            data = _data;
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(data.title);
            expect(res.body.content).to.equal(updateItem.content);
            expect(res.body.folderId).to.equal(data.folderId);
            expect(res.body.tags).to.deep.equal(data.tags);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            // expect note to have been updated
            expect(new Date(res.body.updatedAt)).to.greaterThan(data.updatedAt);
          });
      });
    
      it('should update the note when provided a valid folderId', function () {
        const updateItem = {};
        let data;
    
        return Promise.all([
          Folder.findOne({userId: user.id}),
          Note.findOne({userId: user.id})
        ])
          .then(([folder, note]) => {
            updateItem.folderId = folder.id;
            data = note;
            return chai.request(app).put(`/api/notes/${note.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(data.title);
            expect(res.body.content).to.equal(data.content);
            expect(res.body.folderId).to.equal(updateItem.folderId);
            expect(res.body.tags).to.deep.equal(data.tags);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            // expect note to have been updated
            expect(new Date(res.body.updatedAt)).to.greaterThan(data.updatedAt);
          });
      });
    
      it('should update the note when provided a valid tag', function () {
        const updateItem = {
          tags: []
        };
        let data;
    
        return Promise.all([
          Tag.findOne({userId: user.id}),
          Note.findOne({userId: user.id})
        ])
          .then(([tag, note]) => {
            updateItem.tags.push(tag.id);
            data = note;
            return chai.request(app).put(`/api/notes/${note.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'createdAt', 'updatedAt', 'userId');
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(data.title);
            expect(res.body.content).to.equal(data.content);
            expect(res.body.folderId).to.equal(data.folderId);
            expect(res.body.tags[0].id).to.deep.equal(updateItem.tags[0]);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            // expect note to have been updated
            expect(new Date(res.body.updatedAt)).to.greaterThan(data.updatedAt);
          });
      });
    
      it('should respond with status 400 and an error message when `id` is not valid', function () {
        const updateItem = {
          title: 'What about dogs?!',
          content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
        };
        return chai.request(app)
          .put('/api/notes/NOT-A-VALID-ID')
          .set('Authorization', `Bearer ${token}`)
          .send(updateItem)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal('The `id` is not valid');
          });
      });
    
      it('should respond with a 404 for an id that does not exist', function () {
        // The string "DOESNOTEXIST" is 12 bytes which is a valid Mongo ObjectId
        const updateItem = {
          title: 'What about dogs?!',
          content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
        };
        return chai.request(app)
          .put('/api/notes/DOESNOTEXIST')
          .set('Authorization', `Bearer ${token}`)
          .send(updateItem)
          .then(res => {
            expect(res).to.have.status(404);
          });
      });
    
      it('should return an error when "title" is an empty string', function () {
        const updateItem = { title: '' };
        let data;
        return Note.findOne({userId: user.id})
          .then(_data => {
            data = _data;
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Missing `title` in request body');
          });
      });
    
      it('should return an error when `folderId` is not valid ', function () {
        const updateItem = {
          folderId: 'NOT-A-VALID-ID'
        };
        return Note.findOne({userId: user.id})
          .then(data => {
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('The `folderId` is not valid');
          });
      });
    
      it('should unset a note folderId when provided a empty string', function () {
        const updateItem = {
          folderId: ''
        };
        let data;
    
        return Note.findOne( {$and: [{userId: user.id},{ folderId: { $exists: true } }]})
          .then((note) => {
            data = note;
            return chai.request(app).put(`/api/notes/${note.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(data.title);
            expect(res.body.content).to.equal(data.content);
            expect(res.body.folderId).to.not.exist;
            expect(res.body.tags).to.deep.equal(data.tags);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            // expect note to have been updated
            expect(new Date(res.body.updatedAt)).to.greaterThan(data.updatedAt);
          });
      });
    
      it('should return an error when a tag `id` is not valid ', function () {
        const updateItem = {
          tags: ['NOT-A-VALID-ID']
        };
        return Note.findOne({userId: user.id})
          .then(data => {
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('The `tags` array contains an invalid `id`');
          });
      });
    
      it('should catch errors and respond properly', function () {
        sandbox.stub(Note.schema.options.toJSON, 'transform').throws('FakeError');
    
        const updateItem = {
          title: 'What about dogs?!',
          content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
        };
        return Note.findOne({userId: user.id})
          .then(data => {
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateItem);
          })
          .then(res => {
            expect(res).to.have.status(500);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Internal Server Error');
          });
      });
    
    });

  });

});