'use strict';

const mongoose = require('mongoose');
const { logger } = require('../config/logger');

const mongoConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
			maxPoolSize: 50, // Increase pool size for handling high traffic
			serverSelectionTimeoutMS: 5000, // Timeout after 5s
			socketTimeoutMS: 60000 // Close sockets after 60s
		});
		console.log('\nMongoDB Connected...');
		logger.info({ requestId: '', message: `Mongodb Connected` });
	} catch (error) {
		console.error('MongoDB Connection Error:', error);
		process.exit(1);
	}
};

module.exports = { mongoConnect };
