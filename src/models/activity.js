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
    field: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true
    },
    region: [{
        type: String,
        required: true
    }],
    institute: {
        type: String
    },
    instituteURL: {
        type: String
    },
    area: {
        type: String
    },
    content: {
        type: String
    },
    mainImageUrl: {
        type: String
    },
    extraImageUrl: [{
        type: String
    }],
    views: {
        type: Number,
        default: 0
    },
    startedAt: {
        type: Date,
        required: true
    },
    endedAt: {
        type: Date,
        required: true
    },
    reports: {
        type: Number,
        default: 0
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