const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    linkedPageUrl: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = {
    Banner
};