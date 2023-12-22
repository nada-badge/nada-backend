const { Storage } = require('@google-cloud/storage');
const config = require('../../config/config');

async function uploadImage(req, res, next) {
    try {
        return res.json(req.files);
    }
    catch (err) {
        next(err);
    }
}

async function deleteImage(req, res, next) {
    try {
        const filePath = req.query.imageUrl;

        const storage = new Storage({
            projectId: config.CLOUD_PROJECT_ID,
            keyFilename: config.KEY_PATH,
        });

        const bucket = storage.bucket(config.BUCKET_NAME);
        const file = bucket.file(filePath);
        
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ message: '파일이 존재하지 않습니다.' });
        }

        await file.delete();

        return res.status(200).json({ message: '파일이 삭제되었습니다.' });
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    uploadImage,
    deleteImage
}