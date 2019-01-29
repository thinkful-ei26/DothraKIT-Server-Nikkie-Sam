'use strict';

const mongoose = require('mongoose');


const WordSchema = new mongoose.Schema({
  english: {type: String, required: true},
  dothraki: {type: String, required: true},
  currentCorrect: {type: Boolean, default: false},
  totalCorrect: {type: Number, default: 0},
  totalWrong: {type: Number,default: 0},
  next: {type: Number, default: 0},
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});



WordSchema.methods.serialize = function() {
  return {
    english: this.english,
    dothraki: this.dothraki,
    currentCorrect: this.currentCorrect,
    totalCorrect: this.totalCorrect,
    totalWrong: this.totalWrong,
    next: this.next,
    userId: this.userId,
  };
};


const Word = mongoose.model('Word', WordSchema);

module.exports = {Word, WordSchema};