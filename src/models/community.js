const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isEdited: {
        type: Boolean,
        default: false
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

const CommentSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replies: [{
        type: ReplySchema
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
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

const PostSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    mainCategory: {
        type: String,
        required: true
    },
    category: [{
        type: String,
        required: true
    }],
    field: [{
        type: String,
        required: true
    }],
    area: [{
        type: String,
        required: true
    }],
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        type: CommentSchema
    }],
    views: {
        type: Number,
        default: 0
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

const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Reply = mongoose.model('Reply', ReplySchema);

module.exports = {
    Post,
    Comment,
    Reply
};