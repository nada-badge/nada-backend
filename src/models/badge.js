const mongoose = require('mongoose')

const BadgeSchema = new mongoose.Schema({
    onwerEmail: {
        type: String,
        required: true
    },
    badgeName: {
        type: String,
        required: true,
        unique: true
    },
    category: { 
        type: String, 
        required: true
    },
    groupInfo: { 
        groupName: { 
            type: String
        },
        team: {
            type: String
        },
        role: { 
            type: String
        }
    },
    issuer: { 
        type: String, 
        required: true
    },
    records: [{
        name: {
            type: String
        },
        startMonth: {
            type: Date,
            required: true
        },
        endMonth: {
            type: Date,
            required: true
        }
    }],
    description: {
        type: String 
    },
    status: {
        type: String,
        enum: ['issued', 'issuing']
    },
    accessScope: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    badgeImageUrl: {
        type: String, 
        required: true
    },
    activityImageUrl: [{
        type: String, 
    }],
    claimedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    issuedAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const Badge = mongoose.model('Badge', BadgeSchema);

module.exports = {
    Badge
};