const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const secretKeyEnv = process.env.ENCRYPTION_SECRET_KEY;

function authourize(req, res, next) {
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
}

module.exports = { authourize };
