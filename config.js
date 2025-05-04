require('dotenv').config();

module.exports = {
    secret_key: process.env.SECRET_KEY,
    app_id: process.env.APP_ID,
    key1: process.env.KEY1,
    end_point_zalo: process.env.END_POINT_ZALOSB,
    key2: process.env.KEY2,
    callback_url: process.env.CALLBACK_URL
}