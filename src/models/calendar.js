const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
    scheduleName: {
        type: String,
        required: true
    },
    groupId: {
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

const CalendarSchema = new mongoose.Schema({
    calendarCategory: {
        type: Number,
        required: true
    },
    activitys: [{
        type: mongoose.Schema.ObjectId, ref: 'Activity'
    }],
    schedules: [{
        type: ScheduleSchema
    }]
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = {
    Schedule,
    Calendar
};