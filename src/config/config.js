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

    NODE_ENV: process.env.NODE_ENV,

    CHAIN_ENV: process.env.CHAIN_ENV,

    MAIN_WALLET: process.env.MAIN_WALLET,
    PRIVATE_KEY: process.env.PRIVATE_KEY,

    CHAIN_NETWORK_URL: process.env.CHAIN_NETWORK_URL_PUBLIC,

    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    CONTRACT_JSON_PATH: process.env.CONTRACT_AFTER_BUILD_PATH 
};


