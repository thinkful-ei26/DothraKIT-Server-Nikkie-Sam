'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();
const { User } = require('../users/models');

// const jsonParser = bodyParser.json();

router.use(bodyParser.json());

// get first word on list
router.get('/:userId', (req, res) => {
  // console.log('userIssssd',req.params.userId);
  User.findById(req.params.userId)
    .then(user => {
      console.log('IN GET',user.words[0]);
      res.status(200).json(user.words[0]);
    });
});

// update word data after answering 
router.put('/:userId', (req, res) => {
  const { totalTries, currentCorrect, totalCorrect, totalWrong, next } = req.body;
  let userAnswer={currentCorrect, totalCorrect, totalWrong, next, totalTries};

  User.findById(req.params.userId)
    .then(user => {
      //update the obj at user.words[0] using the  spread operator or object.assign  to update the stats
      let currentFirst = user.words[0];
      currentFirst = Object.assign({},currentFirst, userAnswer);
      //shift the first obj in the array, and push it into the back
      user.words.shift();
      user.words.push(currentFirst);
      return user.save(); //save the mutated array - its an async fn
    })
    .then((user)=>{
      res.status(200).end();
    });
});



module.exports = {router};