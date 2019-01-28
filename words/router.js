'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();
const { User } = require('../users/models');

router.use(bodyParser.json());


// update wordprogress  on a put

router.get('/:userId', (req, res) => {
  // console.log('userIssssd',req.params.userId);
  User.findById(req.params.userId)
    .then(user => {
      // console.log('>><>>',user.words);
      res.json(user.words);
    });
});





module.exports = {router};