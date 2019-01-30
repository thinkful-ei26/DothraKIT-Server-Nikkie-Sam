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
      console.log('THE WORD SENT BACK IN FETCH IS', user.words[user.head]);
      res.status(200).json({dothraki: user.words[user.head].dothraki, english: user.words[user.head].english});
    });
});

// update word data after answering 
router.put('/:userId', (req, res) => {
  console.log("HERE");
  let userAnswer=req.body.answer; //not sure how I'm sending the users response
  console.log('THE USER ANSWER IS', userAnswer);
  let answerCorrect=false;
  let individualWordScore = 0;

  User.findById(req.params.userId)
    .then(user => {
      if (userAnswer === user.words[user.head].english){
        user.words[user.head].totalCorrect+=1;
        user.words[user.head].totalTries+=1;
        user.words[user.head].mValue*=2;
        answerCorrect= true;
        console.log('CORRECT');
      }
      else {
        user.words[user.head].totalTries+=1;
        user.words[user.head].mValue=1;  
        answerCorrect=false;  
      }

      individualWordScore = Math.floor(user.words[user.head].totalCorrect/user.words[user.head].totalTries)*100;

      //save the value of the current head
      let currentHead = user.head; 
      console.log('current Head is',currentHead);

      // save the node that you just answered 
      let currentNode = user.words[currentHead];
      console.log('current node is', currentNode);

      //We need to do this to update the values update the currentNode with the user's answer and save it back into user.words: 
      // only should show updated mvalue
      // currentNode = Object.assign({},currentNode, userAnswer);
      // user.words[currentHead]=currentNode;
      // console.log('CURRENT UPDATED NODE IN WORDS IS', user.words[currentHead]);

      //find the location of the answered node based on mValue
      let newLocation = currentNode.mValue; 
      console.log('NEW LOCATION IS', newLocation); //2

      //change the current head to whoever answered node's next pointer is addressed to 
      user.head = (currentNode.next>0 ? currentNode.next : 0); //1
      console.log('NEW HEAD IS', user.head);

      let current=currentNode;
      let counter=0;
      while(counter<newLocation && counter < user.words.length - 1){
      
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
    
      //printing out each word to examine it
      while(current!==undefined){
        console.log(current.dothraki);
        current = user.words[current.next];
      }
      res.status(200).json({answerCorrect, individualWordScore});
    });
});

module.exports = {router};
//Your average score on this word is: NaN% -- gotta fix that too....

