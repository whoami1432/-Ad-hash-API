const crypto = require('crypto');

const algorithm = 'aes-256-ecb'; // AES with ECB mode (No IV)
const secretKey = crypto.createHash('sha256').update('your-secret-key').digest(); // 256-bit key

// Encrypt Function
function encryptPassword(password) {
	const cipher = crypto.createCipheriv(algorithm, secretKey, null); // No IV needed
	let encrypted = cipher.update(password, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}

// Decrypt Function
function decryptPassword(encryptedData) {
	const decipher = crypto.createDecipheriv(algorithm, secretKey, null); // No IV needed
	let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

// Example Usage
const password = 'mySecurePassword';
const encrypted = encryptPassword(password);
console.log('Encrypted:', encrypted);

const decrypted = decryptPassword(encrypted);
console.log('Decrypted:', decrypted);
