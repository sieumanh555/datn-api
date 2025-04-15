// var express = require('express');
// var router = express.Router();
// const jwt = require('jsonwebtoken');
// const middlewareController = require('../mongo/middlewareController');

// router.post('/order', function (req, res) {
//     const {item, description, amount} = req.body;
//     const currentDate = dayjs();
//     const app_time = currentDate.valueOf();
//     const tranId = currentDate.format('YYMMDD');
//     const app_trans_id = `${tranId}_${app_time}`;
//     const key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
//     const data = {
//         "amount": amount,
//         "app_id": 2553,
//         "app_time": app_time,
//         "app_trans_id": app_trans_id,
//         "app_user": "demo",
//         "bank_code": "zalopayapp",
//         "description": description,
//         "embed_data": JSON.stringify({}),
//         "item": JSON.stringify(items),
//         "key1": key1,
//         "mac": ""
//     }
//     // hmac_input: 2553|220817_1660717311101|ZaloPayDemo|10000|1660717311101|{}|[]
//     // mac: cf0ff27956f4d6203ce4a2c55691d81b65de2d640ee65e95ae5627ce801cd962
//     const hmac_input = `${data.app_id}|${data.app_trans_id}| ${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
//     const mac = crypto.createHmac('sha256', key1).update(hmac_input).digest('hex');

//     data.mac = mac;

//     request({
//         url: "https://sb-openapi.zalopay.vn/v2/create",
//         method: "POST",
//         json: true,
//         body: data
//     }, function(error, response, body){
//         if(body.return_code === 1){
//             console.log("Body: ", body);
//             res.send(body)
//         } else {
//             res.status(500).send(body);
//         }
//     })
// })

