var express = require("express");
var router = express.Router();
const {zaloPayment, handleZaloCallback} = require("../mongo/controller/checkout");

router.post("/zaloPay", async function (req, res) {
    try {
        const {products, total, orderDescription, orderInfo} = req.body;

        const result = await zaloPayment(products, total, orderDescription, orderInfo);
        if (result.zaloResponse.return_code === 1) {
            return res.status(result.status).json(result);
        } else {
            return res.status(result.status).json(result);
        }
    } catch (error) {
        console.log(">>> Lỗi server", error);
        return res.status(500).json({status: 500, message: "Lỗi server"})
    }
})

router.post("/zaloPay/callback", async function (req, res) {
    try {
        const body = req.body;

        const result = await handleZaloCallback(body);
        console.log(">>>Check result: ", result);
        if (result.status === 200) {
            return res.status(result.status).json(result);
        } else {
            return res.status(result.status).json(result);
        }
    } catch (error) {
        console.log(">>> Lỗi server", error);
        return res.status(500).json({status: 500, message: "Lỗi server"})
    }
})

module.exports = router;