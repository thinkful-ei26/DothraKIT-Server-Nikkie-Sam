'use strict';

const mongoose = require('mongoose');


const WordSchema = new mongoose.Schema({
  english: {type: String, required: true},
  dothraki: {type: String, required: true},
  currentCorrect: {type: Boolean, default: false},
  totalCorrect: {type: Number, default: 0},
  totalWrong: {type: Number,default: 0}
});



WordSchema.methods.serialize = function() {
  return {
    english: this.english,
    dothraki: this.dothraki,
    currentCorrect: this.currentCorrect,
    totalCorrect: this.totalCorrect,
    totalWrong: this.totalWrong
  };
};


const Word = mongoose.model('Student', WordSchema);

module.exports = {Word, WordSchema};