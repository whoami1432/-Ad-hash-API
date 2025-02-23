'use strict';
const express = require('express');

const router = express.Router();

const helloWorld = require('../controllers/helloWorld.controller');
const user = require('../utils/autherize');

router.use(user.authourize);
router.get('/helloworld', helloWorld.helloWorld);

module.exports = router;
