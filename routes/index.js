const express = require('express');
const talker = require('./talker');
const login = require('./login');

const index = express.Router();

index.use('/login', login);

index.use('/talker', talker);

module.exports = index;