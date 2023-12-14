const { Storage } = require('@google-cloud/storage');
const config = require('../../config/config');
const { Banner } = require('../../models/banner');

async function addBanner(req, res, next) {
    try {
        const { title, imageUrl, linkedPageUrl, isActive } = req.body;

        const isExist = await Banner.findOne({ 'title': title, 'imageUrl': imageUrl });

        if (isExist) {
            return res.status(401).json({ message: '이미 등록된 배너입니다.' });
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'imageUrl 값이 null 입니다.' });
        }

        const banner = new Banner({
            title,
            imageUrl,
            linkedPageUrl,
            isActive
        });

        await banner.save();

        return res.status(200).json({ banner });
    }
    catch (err) {
        next(err);
    }
};

async function listBanner(req, res, next) {
    try {
        const banners = await Banner.find({ isActive: true });

        if (!banners || banners.length == 0) {
            return res.status(404).json({ message: '배너 이미지가 존재하지 않습니다.' });
        }

        return res.status(200).json({ banners });
    }
    catch (err) {
        next(err);
    }
};

async function getBanner(req, res, next) {
    try {
        const { _id, title } = req.query;

        const banner = _id ? await Banner.findById(_id) : await Banner.findOne({ title });

        if (!banner) {
            return res.status(404).json({ message: '배너 정보가 존재하지 않습니다.' });
        }

        return res.status(200).json({ banner });
    }
    catch (err) {
        next(err);
    }
};

async function activateBanner(req, res, next) {
    try {
        const banner_id = req.params.banner_id;

        const banner = await Banner.findById(banner_id);

        if (!banner) {
            return res.status(404).json({ message: '배너 정보가 존재하지 않습니다.' });
        }

        banner.isActive = true;

        await banner.save();

        return res.status(200).json({ banner });
    }
    catch (err) {
        next(err);
    }
};

async function deactivateBanner(req, res, next) {
    try {
        const banner_id = req.params.banner_id;

        const banner = await Banner.findById(banner_id);

        if (!banner) {
            return res.status(404).json({ message: '배너 정보가 존재하지 않습니다.' });
        }

        banner.isActive = false;

        await banner.save();

        return res.status(200).json({ banner });
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    addBanner,
    listBanner,
    getBanner,
    activateBanner,
    deactivateBanner
};