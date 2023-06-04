const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: Number(process.env.PORT),

    mongoURI: process.env.DB_URI,
    
    JWT_SECRET: process.env.JWT_SECRET
};


