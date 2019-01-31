'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const app = express();

const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: userRouter } = require('./users');
const { router: wordRouter } = require('./words');
const { router: overallProgressRouter } = require('./overallProgress');
const {words} = require('./data/words');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);
app.use(express.json());


app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/word', wordRouter);
app.use('/overallProgress', overallProgressRouter);


// const jwtAuth = passport.authenticate('jwt', { session: false });
// app.get('/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: `${words}`
//   });
// });


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
