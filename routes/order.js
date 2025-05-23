var express = require("express");
var router = express.Router();

const orderController = require("../mongo/controller/oder.controller");

router.get("/", async (req, res) => {
    try {
        const result = await orderController.getAll();
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
});
router.get("/orderfailed", async (req, res) => {
    try {
        const result = await orderController.getAllOrderFailed();
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
});
router.get("/ordertotaladay", async (req, res) => {
    try {
        const result = await orderController.getTotalADay();
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
});
router.get("/ordertotal", async (req, res) => {
    try {
        const result = await orderController.getTotal();
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
});
router.get("/orderday", async (req, res) => {
    try {
        const result = await orderController.getAllTodayOrders();
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
});
router.get("/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const result = await orderController.getOrderById(id);
        return res.status(result.status).json(result);
    } catch(error){
        console.log("Lỗi server: ",error);
        return res.status(500).json({status: 500, message: "Lỗi sever"});

    }
})
router.delete("/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const result = await orderController.deleteOrder(id);
        return res.status(result.status).json(result);
    } catch(error){
        console.log("Lỗi server: ",error);
        return res.status(500).json({status: 500, message: "Lỗi sever"});

    }
})
router.get("/uniqueKey/:key", async (req,res)=>{
    try{
        const {key} = req.params;
        const result = await orderController.getOrderByUniqueKey(key);
        return res.status(result.status).json(result);
    } catch(error){
        console.log("Lỗi server: ",error);
        return res.status(500).json({status: 500, message: "Lỗi sever"});

    }
})

router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const result = await orderController.addOrder(body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
})

router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const result = await orderController.editOrder(id, body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(400).json({status: 400, message: error.message})
    }
})

router.post("/user/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const result = await orderController.findOrdersByUser(id);
        return res.status(200).json(result);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "lỗi server"})
    }
})

module.exports = router;