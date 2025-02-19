const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: true
		},
		mobileNumber: {
			type: Number,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		country: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		},
		state: {
			type: String,
			required: true
		},
		gender: {
			type: String,
			enum: ['Male', 'Female', 'Other'],
			required: true
		},
		createdDate: {
			type: Date,
			default: Date.now
		},
		modifiedDate: {
			type: Date
		},
		isDeleted: {
			type: Boolean,
			default: false
		}
	},
	{
		versionKey: false
	}
);

module.exports = mongoose.model('users', userModel);
