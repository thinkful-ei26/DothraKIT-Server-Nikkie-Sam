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
  User.findById(req.params.userId)
    .then(user => {
      res.status(200).json(user.words[user.head]);
    });
});

// update word data after answering 
router.put('/:userId', (req, res) => {
  const { totalTries, currentCorrect, totalCorrect, totalWrong, next, mValue } = req.body;
  let userAnswer={currentCorrect, totalCorrect, totalWrong, next, totalTries, mValue};

  //   User.findById(req.params.userId)
  //     .then(user => {
  //       //update the obj at user.words[0] using the  spread operator or object.assign  to update the stats
  //       let currentFirst = user.words[0];
  //       currentFirst = Object.assign({},currentFirst, userAnswer);
  //       //shift the first obj in the array, and push it into the back
  //       user.words.shift();
  //       user.words.push(currentFirst);
  //       return user.save(); //save the mutated array - its an async fn
  //     })
  //     .then((user)=>{
  //       res.status(200).end();
  //     });
  // });
  User.findById(req.params.userId)
    .then(user => {
      //save the value of the current head
      let currentHead = user.head;
      console.log('current Head is',currentHead);
      // save the node that you just answered 
      let currentNode = user.words[currentHead];
      console.log('current node is', currentNode);
      //update the currentNode with the user's answer: 
      currentNode = Object.assign({},currentNode, userAnswer);
      //somethihng needs to happen with currentNode...
      user.words[currentHead]=currentNode; //trying to save currentNodes values somwhere 
      console.log('CURRENT UPDATED NODE IS', user.words[currentHead]);
      //find the location of the answered node based on mValue
      let newLocation = currentNode.mValue;
      console.log('NEW LOCATION IS', newLocation);
      //so we want to swap with whatever's currently at index 1 which is B so B will show then A again...i thinkya?

      //change the current head to whoever answered node's next pointer is addressed to 
      user.head = currentNode.next;
      console.log('NEW HEAD IS', user.head);
      //find the insertion point stuck here
      let swapWith = user.words[newLocation];
      console.log('SWAP WITH IS', swapWith);
      //insert the node by changing the next pointer sure!
      currentNode.next = swapWith.next;
      swapWith.next = currentHead;
      return user.save();
    })
    .then((user)=>{
      res.status(200).end();
    });
});


module.exports = {router};
//LOL WHAT Your average score on this word is: NaN% -- gotta fix that too....

