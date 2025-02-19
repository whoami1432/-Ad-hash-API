'use strict';

const express = require('express');

const router = express.Router();

const users = require('../controllers/users.controller');

router.post('/register', users.userRegister);
router.post('/login', users.userLogin);

module.exports = router;
