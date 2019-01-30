'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();
const { User } = require('../users/models');

router.use(bodyParser.json());

// get first word on list
router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      console.log('THE WORD SENT BACK IN FETCH IS', user.words[user.head]);
      res.status(200).json(user.words[user.head]);
    });
});

// update word data after answering 
router.put('/:userId', (req, res) => {
  const { totalTries, currentCorrect, totalCorrect, totalWrong, next, mValue } = req.body;
  let userAnswer={currentCorrect, totalCorrect, totalWrong, next, totalTries, mValue};

  User.findById(req.params.userId)
    .then(user => {
      //We can change it and move the logic to the backend :) But we're not sure if our algorithm is even working
      //save the value of the current head
      let currentHead = user.head; 
      console.log('current Head is',currentHead);

      // save the node that you just answered 
      let currentNode = user.words[currentHead];
      console.log('current node is', currentNode);

      //We need to do this to update the values update the currentNode with the user's answer and save it back into user.words: 
      // only should show updated mvalue
      currentNode = Object.assign({},currentNode, userAnswer);
      user.words[currentHead]=currentNode;
      console.log('CURRENT UPDATED NODE IN WORDS IS', user.words[currentHead]);

      //find the location of the answered node based on mValue
      let newLocation = currentNode.mValue; 
      console.log('NEW LOCATION IS', newLocation); //2

      //change the current head to whoever answered node's next pointer is addressed to 
      user.head = currentNode.next; //1
      console.log('NEW HEAD IS', user.head);

      let current=currentNode;
      let counter=0;
      while(counter<newLocation){
        current = user.words[current.next];
        counter++;
        //if we reach the end of the LL, stop counting 
      }
      console.log('NODE AFTER WHILE LOOP IS', current);
      //node is now where we want our currentNode to be inserted
      
      user.words[currentHead].next = current.next; 
      current.next = currentHead;

      //save all the updates we just made to user.head and user.words:
      return User.findByIdAndUpdate({_id:req.params.userId}, {words: user.words, head: user.head}, {new: true});
    })
    .then((user)=>{
      let current= user.words[user.head];
    
      while(current!==undefined){
        console.log(current.dothraki);
        current = user.words[current.next];
      }
      //printing out each word to examine it
      res.status(200).end();
    });
});

module.exports = {router};
//Your average score on this word is: NaN% -- gotta fix that too....

