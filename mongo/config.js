require('dotenv').config();

module.exports = {
    secret_key: process.env.SECRET_KEY,
    port: process.env.PORT || 5000
}