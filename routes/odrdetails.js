var express = require('express');
var router = express.Router();
const orderDetailController = require("../mongo/controller/orderDetail.controller")


router.get("/", async function (req, res) {
    try {
        const result = await orderDetailController.getAll();
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi fetching orderDetail", error);
        return res.status(500).json({status: 500, message: "Lỗi server"})
    }
})

router.get("/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const result = await orderDetailController.getOrderDetailById(id);
        return res.status(result.status).json(result);
    } catch(error){
        console.log("Lỗi server: ",error);
        return res.status(500).json({status: 500, message: "Lỗi sever"});

    }
})

router.post("/", async (req, res) => {
    try {
        const items = req.body;
        const result = await orderDetailController.addOrderDetail(items);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi fetching orderDetail", error);
        return res.status(500).json({status: 500, message: "Lỗi server"})
    }
})

module.exports = router;
