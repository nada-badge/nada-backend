const { contentType } = require('express/lib/response');
const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    userName: {     // 닉네임
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    introduce : {
        type: String
    },
    sex: {
        type: Number
    },
    company : {
        type: String
    },
    school : {
        type: String
    },
    birthday : {
        type: Date
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserSchema = new mongoose.Schema({
    /*
    did: {
        type: String,
        require: true,
        unique: true
    },
    */
    userType: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    profile: {
        type: ProfileSchema,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

    /*
    auth: {
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
    */
});

const User = mongoose.model('User', UserSchema);
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = {
    User,
    Profile
};