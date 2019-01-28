'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const {WordSchema} = require('../words/models');
const {words} = require('../data/words')


mongoose.Promise = global.Promise;

const UserSchema =  mongoose.Schema({
  username: {type: String, required: true,unique: true},
  password: {type: String, required: true},
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  words: {type: Array, default: words},
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username,
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    id: this._id,
    words: this.words

  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
