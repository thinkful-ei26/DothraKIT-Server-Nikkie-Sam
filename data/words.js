'use strict';

const words = [
  {
    english: 'It Is Known',
    dothraki: 'Me nem nesa',
  },
  {
    english:  'Yes',
    dothraki: 'Sek, k\'athjilari',
  },
  {
    english:  'No',
    dothraki: 'Vos. Vosecchi!',
  },
  {
    english: 'Thank You',
    dothraki: 'San athchomari yeraan!',
  },
  {
    english: 'Happy Birthday',
    dothraki: 'Asshekhqoyi vezhvena!',
  },
  {
    english: 'Goodbye',
    dothraki: 'Hajas!',
  },
  {
    english: 'Get Lost',
    dothraki: 'Es havazhaan!',
  },
  {
    english: 'Annoying Woman',
    dothraki: 'Annvikeesi',
  },
  {
    english: 'You Make Me Itch',
    dothraki: 'Yer affesi anni',
  },
  {
    english: 'I Will Let You Live',
    dothraki: 'Anha vazhak yeraan thirat',
  }
];


const users = [
  {
    _id: '000000000000000000000001',
    username: 'msgreen',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  },
  {
    _id: '000000000000000000000002',
    username: 'mryellow',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  }
];

const oneUser = [
  {
    _id: '5c531cd6ab6f3f4decc827ca',
    username: 'jimbob',
    password: '$2a$10$KYN9pLYcdqb1SofAed2zZudw8avle0fldFqnBSshBR1RH0XMbrHz.',
    firstName: 'Jim',
    lastName: 'Bob',
    words: [ 
      {
        english: 'it is known',
        dothraki: 'Me nem nesa.',
        currentCorrect: false,
        totalCorrect: 1,
        totalWrong: 0,
        totalTries: 2,
        next: 3,
        mValue: 2
      }, 
      {
        english: 'yes',
        dothraki: 'Sek, k\'athjilari',
        currentCorrect: false,
        totalCorrect: 1,
        totalWrong: 0,
        totalTries: 1,
        next: 0,
        mValue: 2
      }, 
      {
        english: 'no',
        dothraki: 'Vos. Vosecchi!',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 1,
        mValue: 1
      }, 
      {
        english: 'thank you',
        dothraki: 'San athchomari yeraan!',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 4,
        mValue: 1
      }, 
      {
        english: 'happy birthday',
        dothraki: 'Asshekhqoyi vezhvena!',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 5,
        mValue: 1
      }, 
      {
        english: 'goodbye',
        dothraki: 'Hajas!',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 6,
        mValue: 1
      }, 
      {
        english: 'get lost',
        dothraki: 'Es havazhaan!',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 7,
        mValue: 1
      }, 
      {
        english: 'annoying woman',
        dothraki: 'Annvikeesi',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 8,
        mValue: 1
      }, 
      {
        english: 'you make me itch',
        dothraki: 'Yer affesi anni.',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: 9,
        mValue: 1
      }, 
      {
        english: 'i will let you live',
        dothraki: 'Anha vazhak yeraan thirat.',
        currentCorrect: false,
        totalCorrect: 0,
        totalWrong: 0,
        totalTries: 0,
        next: -1,
        mValue: 1
      }
    ],
    head: 2,
  
    __v: 0
  }];

module.exports = {words, users, oneUser};