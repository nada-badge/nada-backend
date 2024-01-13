const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const { Storage } = require('@google-cloud/storage');
const config = require('../../config/config');
const IMAGE = require('../const/imageSection');

const upload = multer({
    fileFilter: (req, file, cb) => {
        var section = req.body.section;
        if (!section) {
            return cb(new Error('section 값이 null입니다.'), false);
        }
        if (!IMAGE.imageSection.includes(section)) {
            return cb(new Error('section 설정이 잘못되었습니다.'), false);
        }
        cb(null, true);
    },
});

const storage = new Storage({
    projectId: config.CLOUD_PROJECT_ID,
    keyFilename: config.KEY_PATH,
});

const bucket = storage.bucket(config.BUCKET_NAME);

async function uploadToStorage(buffer, filePath) {
    try {
        let file = bucket.file(filePath);

        await file.save(buffer, {
            metadata: {
                contentType: 'image/webp', // 변환된 이미지의 MIME 타입 설정
            },
        });

        const imageUrl = `https://storage.googleapis.com/${config.BUCKET_NAME}/` + filePath
  
        return imageUrl;
    }
    catch (error) {
        console.error('스토리지로 파일 업로드 중 오류 발생:', error);
        return false;
    }
}

module.exports = { 
    upload,
    bucket,
    uploadToStorage
};