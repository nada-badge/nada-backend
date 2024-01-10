const sharp = require('sharp');
const config = require('../../config/config');
const { bucket, uploadToStorage } = require('../../common/utils/image');

async function uploadImage(req, res, next) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: '파일이 존재하지 않습니다.' });
        }
   
        const results = await Promise.all(
            req.files.map(async (file) => {
                const webpBuffer = await sharp(file.buffer).toFormat('webp').toBuffer();
                const webpFileName = `${config.STORAGE_SECTION}/${req.body.section}/${Date.now()}.webp`;
                return uploadToStorage(webpBuffer, webpFileName);
            })
        );

        if (!results) {
            return res.status(500).json({ message: '파일이 정상적으로 업로드 되지 않았습니다.' });
        }
    
        // 메모리에서 원본 이미지 삭제
        sharp.cache(false);

        return res.json({ path: results });
    }
    catch (err) {
        next(err);
    }
}

async function deleteImage(req, res, next) {
    try {
        const filePath = req.query.imageUrl;

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