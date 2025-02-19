const mongoose = require('mongoose');

const taskModel = new mongoose.Schema(
	{
		taskName: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		startDate: {
			type: Date,
			required: true
		},
		endDate: {
			type: Date,
			required: true
		},
		totalTask: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			enum: ['Pending', 'In Progress', 'Completed'],
			required: true
		},
		createdBy: {
			type: String,
			required: true
		},
		modifiedBy: {
			type: String
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

module.exports = mongoose.model('tasks', taskModel);
