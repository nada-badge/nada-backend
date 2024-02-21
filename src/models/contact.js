const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    registeredAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        require: true,
        default: false
    }
})

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = {
    Contact
};