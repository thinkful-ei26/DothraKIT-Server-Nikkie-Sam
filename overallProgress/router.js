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
      let totalGuesses = user.words.map(words => words.totalTries).reduce((prev, next) => prev + next);
      let totalCorrect = user.words.map(words => words.totalCorrect).reduce((prev, next) => prev + next);
      console.log('THE OVERALLPROGRESS SENT BACK IN FETCH IS', Math.floor(100 *(totalCorrect/totalGuesses)));
      let progress = totalGuesses!==0 ? Math.floor(100 *(totalCorrect/totalGuesses)) : 0;
      res.status(200).json(progress);
    });
});

module.exports = {router};