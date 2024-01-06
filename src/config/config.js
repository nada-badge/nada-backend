const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: Number(process.env.PORT),

    mongoURI: process.env.DB_URI,

    CLOUD_PROJECT_ID: process.env.CLOUD_PROJECT_ID,

    BUCKET_NAME: process.env.BUCKET_NAME,
    KEY_PATH: process.env.ACCOUNT_KEY,
    STORAGE_SECTION: process.env.STORAGE_SECTION,

    HOME_BANNER_PREFIX: process.env.HOME_BANNER_PREFIX,
    
    JWT_SECRET: process.env.JWT_SECRET,

    NODE_ENV: process.env.NODE_ENV
};


