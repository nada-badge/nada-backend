const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const config = require('../../config/config');
const IMAGE = require('../const/imageSection');
 
const uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: config.BUCKET_NAME,
        projectId: config.CLOUD_PROJECT_ID,
        keyFilename: config.KEY_PATH,
        filename: (req, file, cb) => {
            cb(null, `${config.STORAGE_SECTION}/${req.body.section}/${Date.now()}.${file.originalname.split('.').pop()}`); 
        },
    }),
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
  //  limits: { fileSize: 5*1024*1024},
});

module.exports = { 
    uploadHandler
};