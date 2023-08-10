const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema({
    activityName: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    field: {
        type: Number,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    startedAt: {
        type: Date,
        required: true
    },
    endedAt: {
        type: Date,
        required: true
    },
    registeredAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = {
    Activity
};