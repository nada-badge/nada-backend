const mongoose = require('mongoose');
const { Badge } = require('./badge');

const ProfileSchema = new mongoose.Schema({
    userName: {     // 닉네임
        type: String
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
    region : [{
        type: String
    }],
    interestField  : [{
        type: String
    }],
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const MemberSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    team: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        required: true
    },
    badges: [{
        type: mongoose.Schema.ObjectId, ref: 'group',
    }],
    startedAt: {
        type: Date,
        required: true
    },
    endedAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    represent: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    role: {
        type: String
    },
    memberInfo: {
        type: MemberSchema
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
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
    groups: [{
        type: mongoose.Schema.ObjectId, ref: 'group',
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    calendar: {
        type: mongoose.Schema.ObjectId, ref: 'Calendar',
    },  
    /*
    auth: {
        // 임베디드
    }
    */
});

const User = mongoose.model('User', UserSchema);
const Profile = mongoose.model('Profile', ProfileSchema);
const Group = mongoose.model('Group', GroupSchema);
const Member = mongoose.model('Member', MemberSchema);

module.exports = {
    User,
    Profile,
    Group,
    Member
};