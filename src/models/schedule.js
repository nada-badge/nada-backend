const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
    scheduleName: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
    },
    groupName: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    category: {
        type: String,
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

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = {
    Schedule
};