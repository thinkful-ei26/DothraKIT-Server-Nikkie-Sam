'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const { User } = require('../users/models');

router.use(bodyParser.json());

// get first word on list
router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      //new way of calculating progress (otherwise if they get 1 word right in the beginning it tells them their mastery is 100% which is wrong)

      //add together the "mastery" of each word, mastery being a decimal between 0 and 1 (so if their mastery of a word is 50%, .5)
      let masteryOfWordsArr = user.words.map(word=> word.totalTries===0 ?0 : (word.totalCorrect/word.totalTries));
      let sumMastery = masteryOfWordsArr.reduce((a, b) => a + b, 0);
      console.log(masteryOfWordsArr);

      //progress = sum of the masteries / number of total words
      let progress = sumMastery / user.words.length * 100;
      progress = Math.round(progress * 100) / 100;
      res.status(200).json(progress);
    });
});

module.exports = {router};