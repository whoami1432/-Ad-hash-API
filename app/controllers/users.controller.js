'use strict';

const crypto = require('node:crypto');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { logger } = require('../../config/logger');
const userModel = require('../models/users.model');

const algorithm = process.env.ENCRYPTION_ALGORITHM;
const secretKeyEnv = process.env.ENCRYPTION_SECRET_KEY;
const secretKey = crypto.createHash('sha256').update(secretKeyEnv).digest();

exports.userRegister = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} User register request received` });

		/** Joi validator using validate the request data */
		const schema = Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			mobileNumber: Joi.number().required(),
			password: Joi.string().required(),
			country: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			gender: Joi.string().required()
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

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

		logger.info({ requestId: req.id, message: `User request validation completed` });

		const { _id } = (await userModel.findOne({ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { _id: 1 })) || {};
		if (_id) {
			logger.info({ requestId: req.id, message: `User already registered` });

			return res.status(200).json({
				message: 'User Already Exists',
				data: []
			});
		}

		logger.info({ requestId: req.id, message: `Going to encrypt the password` });

		const body = req.body;

		const cipher = crypto.createCipheriv(algorithm, secretKey, null); // No IV needed
		const encrypted = cipher.update(body.password, 'utf8', 'hex');
		const encryptedPassword = encrypted + cipher.final('hex');

		delete body.password;
		body.password = encryptedPassword;

		logger.info({ requestId: req.id, message: `Encrypt the password completed` });

		const data = await userModel.create(body);
		if (data?._id) {
			logger.info({ requestId: req.id, message: `User Registered Successfully` });
			return res.status(201).json({
				Message: 'User Registered Successfully',
				data: data
			});
		}
		logger.info({ requestId: req.id, message: `User Registration Failed` });
		return res.status(500).json({
			message: 'User Registration Failed',
			data: []
		});
	} catch (error) {
		next(error);
	}
};

exports.userLogin = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} User register request received` });

		if (!req.body.email || !req.body.password) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'Email and Password are required',
				data: []
			});
		}

		const { _id, name, gender, email, password } = await userModel.findOne({ email: req.body.email }, { _id: 1, name: 1, gender: 1, email: 1, password: 1 });
		if (!_id) {
			logger.info({ requestId: req.id, message: `User not foud` });
			return res.status(401).json({
				message: 'User not found',
				data: []
			});
		}

		const decipher = crypto.createDecipheriv(algorithm, secretKey, null);
		const decrypted = decipher.update(password, 'hex', 'utf8');
		const decryptedDBPassword = decrypted + decipher.final('utf8');

		if (_id && req.body.password === decryptedDBPassword) {
			const token = jwt.sign({ username: name, gender, email }, secretKeyEnv, { expiresIn: '5h' });
			logger.info({ requestId: req.id, message: `Login Successfully` });
			return res.status(200).json({
				Message: 'User Login Successfully',
				data: {
					token
				}
			});
		}

		logger.info({ requestId: req.id, message: `login Failed` });
		return res.status(401).json({
			message: 'User Login Failed',
			data: []
		});
	} catch (error) {
		next(error);
	}
};

exports.authourize = async (req, res, next) => {
	logger.info({ requestId: req.id, message: `Token Validation` });
	const token = req.header('Auth-Token');
	if (!token) {
		logger.info({ requestId: req.id, message: `Token not found` });
		return res.status(401).json({ error: 'Access Denied' });
	}

	jwt.verify(token, secretKeyEnv, (err, user) => {
		if (err) {
			logger.info({ requestId: req.id, message: `Token verify error` });

			return res.status(403).json({ error: 'Invalid token' });
		}
		logger.info({ requestId: req.id, message: `Token is valid` });
		req.user = user;
		next();
	});
};
