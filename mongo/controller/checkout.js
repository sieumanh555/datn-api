const cryto = require("crypto");
const moment = require("moment");
const config = require("../../config");
module.exports = {zaloPayment}

async function zaloPayment() {
    try {
        const app_id = config.app_id;
        const key1 = config.key1;
        const callback_url = config.callback_url;

        const embed_data = {};
        const items = [""];
        const trans_id = `${moment().format("YYMMDD")}_${Math.floor(Math.randoom() * 1000000)}`;
        const order = {
            app_id,
            app_trans_id: trans_id,
            app_user: "Tấn Đạt",
            app_time: Date.now(),
            item: items,
            embed_data,
            amount,
            description,
            bank_code: "",
            callback_url
        }

        const data = app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + embed_data + "|" + items;

        order.mac = crypto.createHmac("sha256", key1).update(data).digest("hex");

        try{

        } catch(error){

        }
    } catch (error) {

    }
}