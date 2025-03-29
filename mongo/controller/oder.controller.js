const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
module.exports = {
    getAll,
    getOrderById,
    addOrder,
    editOrder,
    findOrdersByUser
};

async function getAll() {
    try {
        const orders = await orderModel.find().sort({_id: -1}).populate("userId").populate("orderDetailId");
        return {status: 200, message: "fetch data orders thành công", data: orders}
    } catch (error) {
        console.log("Lỗi fetch data orders: ", error);
        return {status: 500, message: "Lỗi fetch data orders"}
    }
}
async function getOrderById(id) {
    try {
        const order = await orderModel.find({_id: id}).sort({_id: -1}).populate("userId", "name").populate("orderDetailId");

        return {status: 200, message: "Lấy dữ liệu đơn hàng theo id thành công", data: order};
    } catch (error) {
        console.log(error);
        return {status: 500, message: "Lỗi lấy dữ liệu đơn hàng", data: orders};
    }
}

async function addOrder(body) {
    try {
        const {userId, orderDetailId, amount, status} = body;
        const order = new orderModel({
            userId,
            orderDetailId,
            amount,
            status
        });
        await order.save();
        return {status: 200, message: "Thêm order thành công", data: order}
    } catch (error) {
        console.log("Lỗi thêm order: ", error)
        return {status: 500, message: "Thêm order thất bại"}
    }
}

async function editOrder(id, body) {
    try {
        const {userId, OrderDetailId, amount, status} = body;
        const order = await orderModel.findById(id);
        if (!order) {
            return {status: 404, message: "Không tìm thấy đơn hàng"};
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(id, {
            userId,
            OrderDetailId,
            amount,
            status
        }, {new: true});
        return {status: 200, message: "Sửa order thành công", data: updatedOrder}
    } catch (error) {
        console.log("Lỗi chỉnh sửa order: ", error);
        return {status: 500, message: "Lỗi chỉnh sửa order"}
    }
}

async function findOrdersByUser(id) {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return {status: 404, message: "Tài khoản không tồn tại"}
        }
        const orders = await orderModel.find({userId: id}).sort({_id: -1}).populate("userId", "name").populate("orderDetailId");

        return {status: 200, message: "Lấy dữ liệu đơn hàng theo user thành công", data: orders};
    } catch (error) {
        console.log(error);
        return {status: 500, message: "Lỗi lấy dữ liệu đơn hàng"};
    }
}