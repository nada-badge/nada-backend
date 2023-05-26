const mongoose = require('mongoose')

/*
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ProfilingLevel } = require('mongodb');
*/

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    /*
    did: String,
    user_id: String,
    role: Uint8Array,
    auth: {
        // 임베디드
    },
    Profile: {
        // 임베디드
    },
    badges: [{
        // 임베디드
    }],
    calendar: {
        // type: mongoose.Schema.ObjectId, ref: 'Calendar',
    },  
    groups: [{
        // type: mongoose.Schema.ObjectId, ref: 'Group',
    }],
    group_info: {
        // 임베디드
    },
    joined_at: {
        type: Date,
        default: Date.now()
    }
    */
})

module.exports = mongoose.model('User', UserSchema);