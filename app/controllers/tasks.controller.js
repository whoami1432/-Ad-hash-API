'use strict';

const Joi = require('joi');
const mongoose = require('mongoose');

const { logger } = require('../../config/logger');
const tasksModel = require('../models/task.model');

exports.getAllTasks = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} get all task request received` });

		const data = await tasksModel.find({ isDeleted: false }, { _id: 1, description: 1, taskName: 1, createdate: 1, status: 1, startDate: 1, endDate: 1, totalTask: 1 }).sort({ createdate: -1 });
		if (data.length === 0) {
			return res.status(200).json({
				message: 'No task found',
				data: []
			});
		}
		return res.status(200).json({
			Message: 'All tasks fetched successfully',
			data: data
		});
	} catch (error) {
		next(error);
	}
};

exports.createTask = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} create task request received` });

		/** Joi validator using validate the request data */
		const schema = Joi.object().keys({
			taskName: Joi.string().required(),
			description: Joi.string().required(),
			status: Joi.string().required(),
			startDate: Joi.date().required(),
			endDate: Joi.date().required(),
			totalTask: Joi.number().required()
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		logger.info({ requestId: req.id, message: `Validating create task request` });

		/** Passing the reques details into validater */
		const { error } = schema.validate(req.body, options);

		/** Check if any error is available request data if error occured pass into UI */
		if (error) {
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';
			return res.status(500).json({
				message: errorMessage,
				data: []
			});
		}

		logger.info({ requestId: req.id, message: `Task request validation completed` });

		const isTaskExist = await tasksModel.find({ taskName: req.body.taskName, isDeleted: false }, { _id: 1 });
		if (isTaskExist.length > 0) {
			logger.info({ requestId: req.id, message: `Task already exists` });

			return res.status(200).json({
				message: 'Task Already Exists',
				data: []
			});
		}

		const data = await tasksModel.create({ ...req.body, ...{ createdBy: req.user.username } });

		if (data?._id) {
			logger.info({ requestId: req.id, message: `Task created successfully` });

			return res.status(200).json({
				message: 'Task created successfully',
				data
			});
		}
		logger.info({ requestId: req.id, message: `Task created Failed` });

		return res.status(200).json({
			Message: 'Task created Failed',
			data: []
		});
	} catch (error) {
		next(error);
	}
};

exports.getTask = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} get task request received` });

		if (!req.params.id) {
			return res.status(400).json({
				message: 'Required filed missing',
				data: []
			});
		}

		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message: 'Invalid id',
				data: []
			});
		}

		const data = await tasksModel.findOne({ _id: req.params.id, isDeleted: false }, { _id: 1, description: 1, taskName: 1, createdate: 1, status: 1, startDate: 1, endDate: 1, totalTask: 1 });
		if (!data) {
			return res.status(200).json({
				message: 'No task found',
				data: []
			});
		}
		return res.status(200).json({
			Message: 'Task fetched successfully',
			data: data
		});
	} catch (error) {
		next(error);
	}
};

exports.updateTask = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} update task request received` });
		if (!req.params.id) {
			return res.status(400).json({
				message: 'Required filed missing',
				data: []
			});
		}

		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message: 'Invalid id',
				data: []
			});
		}

		/** Joi validator using validate the request data */
		const schema = Joi.object().keys({
			taskName: Joi.string().required(),
			description: Joi.string().required(),
			status: Joi.string().required(),
			startDate: Joi.date().required(),
			endDate: Joi.date().required(),
			totalTask: Joi.number().required()
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		logger.info({ requestId: req.id, message: `Validating create task request` });

		/** Passing the reques details into validater */
		const { error } = schema.validate(req.body, options);

		/** Check if any error is available request data if error occured pass into UI */
		if (error) {
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';
			return res.status(500).json({
				message: errorMessage,
				data: []
			});
		}

		const task = await tasksModel.updateOne({ _id: req.params.id, isDeleted: false }, { ...req.body, ...{ modifiedBy: req.user.username } });
		if (!task.acknowledged || task.modifiedCount === 0) {
			return res.status(200).json({
				message: 'Task not updated',
				data: []
			});
		}

		res.status(200).json({
			Message: 'Task updated successfully',
			data: { _id: req.params.id, isUpdated: true }
		});
	} catch (error) {
		next(error);
	}
};

exports.deleteTask = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} delete task request received` });

		if (!req.params.id) {
			return res.status(400).json({
				message: 'Required filed missing',
				data: []
			});
		}

		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message: 'Invalid id',
				data: []
			});
		}

		const isAlreadyUpdated = await tasksModel.findOne({ _id: req.params.id, isDeleted: true }, { _id: 1, isDeleted: 1 });
		if (isAlreadyUpdated?.isDeleted) {
			return res.status(200).json({
				message: 'Task already deleted',
				data: []
			});
		}

		const data = await tasksModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });

		res.status(200).json({
			Message: 'Task deleted successfully',
			data: data
		});
	} catch (error) {
		next(error);
	}
};

exports.statusFilter = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} get task request received` });

		if (!req.params.status) {
			return res.status(400).json({
				message: 'Required filed missing',
				data: []
			});
		}

		if (!['pending', 'in progress', 'completed'].includes(req.params.status?.toLowerCase())) {
			return res.status(400).json({
				message: 'Invalid status',
				data: []
			});
		}

		const data = await tasksModel.find({ status: req.params.status, isDeleted: false }, { _id: 1, description: 1, taskName: 1, createdate: 1, status: 1, startDate: 1, endDate: 1, totalTask: 1 });
		if (!data) {
			return res.status(200).json({
				message: 'No task found',
				data: []
			});
		}
		return res.status(200).json({
			Message: 'Task fetched successfully',
			data: data
		});
	} catch (error) {
		next(error);
	}
};

exports.getTasks = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, username: req.user.username, message: `ip: ${req.ip} ${req.method} ${req.originalUrl} - get all task request received` });

		const { page = 1, limit = 10 } = req.params; // Default: page 1, limit 10

		const pageNumber = parseInt(page, 10);
		const pageSize = parseInt(limit, 10);
		const skip = (pageNumber - 1) * pageSize;

		const [data, totalCount] = await Promise.all([
			tasksModel
				.find({ isDeleted: false }, { _id: 1, description: 1, taskName: 1, createdate: 1, status: 1, startDate: 1, endDate: 1, totalTask: 1 })
				.sort({ createdate: -1 })
				.skip(skip)
				.limit(pageSize),
			tasksModel.countDocuments({ isDeleted: false })
		]);

		return res.status(200).json({
			message: `Page ${page} tasks fetched successfully`,
			data,
			pagination: {
				currentPage: pageNumber,
				pageSize,
				totalPages: Math.ceil(totalCount / pageSize),
				totalCount
			}
		});
	} catch (error) {
		next(error);
	}
};
