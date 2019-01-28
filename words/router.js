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
  console.log('userIssssd',req.params.userId);
  User.findById(req.params.userId)
    .then(user => {
      console.log('>><>>',user.words[1]);
      res.json(user.words[1]);
    });
});

// update word progress when answering 




module.exports = {router};