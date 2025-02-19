'use strict';

const express = require('express');

const router = express.Router();

const tasksController = require('../controllers/tasks.controller');
const user = require('../controllers/users.controller');

router.use(user.authourize);
router.get('/', tasksController.getAllTasks);
router.post('/', tasksController.createTask);
router.get('/:id', tasksController.getTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);
router.get('/filter/:status', tasksController.statusFilter);
router.get('/pagination/:page/:limit', tasksController.getTasks);

module.exports = router;
