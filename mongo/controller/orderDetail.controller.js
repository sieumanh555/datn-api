const orderDetailModel = require("../model/order/orderDetail.model");


module.exports = {
    getAll,
    getOrderDetailById,
    addOrderDetail
}

async function getAll() {
    try {
        const orders = await orderDetailModel.find().sort({_id: -1}).populate("items.productId");
        return {status: 200, data: orders}
    } catch (error) {
        console.log(">>>>> Lỗi getAll orders: ", error);
        return {status: 500, message: "Lỗi getAll orders"}
    }
}

async function getOrderDetailById(id) {
    try {
        const orderDetail = await orderDetailModel.findById(id).populate("items.productId");

        return {status: 200, message: "Lấy dữ liệu chi tiết đơn hàng theo id thành công", data: orderDetail};
    } catch (error) {
        console.log(error);
        return {status: 500, message: "Lỗi lấy dữ liệu chi tiết đơn hàng"};
    }
}

async function addOrderDetail(items) {
    try {
        const orderDetail = new orderDetailModel(items);
        
        await orderDetail.save();

        return {status: 200, message: "thêm orderDetail thành công", data: orderDetail}
    } catch (error) {
        return {status: 500, message: "thêm orderDetail thất bại"}
    }
}