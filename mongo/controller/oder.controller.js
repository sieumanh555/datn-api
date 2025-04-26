const getOrderModel  = require("../model/order/order.model");
const userModel = require("../model/user/user.model");
module.exports = {
    getAll,
    getOrderById,
    getOrderByUniqueKey,
    addOrder,
    editOrder,
    findOrdersByUser,
    getAllTodayOrders,
    getAllOrderFailed
};
let orderModel;

(async () => {
    orderModel = await getOrderModel();
})();
async function getAll() {
    try {
        const orders = await orderModel.find().sort({_id: -1}).populate("userId").populate("orderDetailId").populate("voucherId");
        return {status: 200, message: "fetch data orders thành công", data: orders}
    } catch (error) {
        console.log("Lỗi fetch data orders: ", error);
        return {status: 500, message: "Lỗi fetch data orders"}
    }
}
async function getAllTodayOrders() {
    try {
      // Tính khoảng thời gian từ đầu ngày tới cuối ngày hôm nay
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // 00:00:00
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // 23:59:59
  
      // Tìm đơn hàng có createdAt trong khoảng hôm nay
      const orders = await orderModel.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ _id: -1 });
  
      return { status: 200, message: "Fetch orders today thành công", data: orders };
    } catch (error) {
      console.log("Lỗi fetch orders today: ", error);
      return { status: 500, message: "Lỗi fetch orders today" };
    }
  }
  
async function getAllOrderFailed() {
    try {
        const orders = await orderModel.find({ status: "Processing" }) // Lọc theo trạng thái "Processing"
            .sort({ _id: -1 }) // Sắp xếp theo thứ tự giảm dần của _id
            .populate("userId") // Lấy thông tin người dùng
            .populate("orderDetailId") // Lấy thông tin chi tiết đơn hàng
            .populate("voucherId"); // Lấy thông tin voucher

        return { status: 200, message: "fetch data orders thành công", data: orders };
    } catch (error) {
        console.log("Lỗi fetch data orders: ", error);
        return { status: 500, message: "Lỗi fetch data orders" };
    }
}

async function getOrderById(id) {
    try {
        const order = await orderModel.findOne({_id: id}).sort({_id: -1}).populate("userId", "name").populate("orderDetailId");

        return {status: 200, message: "Lấy dữ liệu đơn hàng theo id thành công", data: order};
    } catch (error) {
        console.log(error);
        return {status: 500, message: "Lỗi lấy dữ liệu đơn hàng"};
    }
}

async function getOrderByUniqueKey(uniqueKey) {
    try {
        const order = await orderModel.findOne({uniqueKey: uniqueKey}).populate("userId", "name").populate("orderDetailId");
        return {status: 200, message: "Lấy dữ liệu đơn hàng theo uniqueKey thành công", data: order};
    } catch (error) {
        console.log(error);
        return {status: 500, message: "Lỗi lấy dữ liệu đơn hàng theo uniqueKey"};
    }
}

async function addOrder(body) {
    try {
        const {
            userId,
            orderDetailId,
            amount,
            description,
            voucherId,
            voucherValue,
            address,
            paymentMethod,
            paymentStatus,
            shipping,
            shippingMethod,
            status
        } = body;

        const order = new orderModel({
            userId,
            orderDetailId,
            amount,
            description,
            voucherId,
            voucherValue,
            address,
            paymentMethod,
            paymentStatus,
            shipping,
            shippingMethod,
            status
        });
        console.log(order);
        await order.save();
        return {status: 200, message: "Thêm order thành công", data: order}
    } catch (error) {
        console.log("Lỗi thêm order: ", error)
        return {status: 500, message: "Thêm order thất bại"}
    }
}

async function editOrder(id, body) {
    try {
        const {
            userId,
            orderDetailId,
            amount,
            description,
            voucherId,
            voucherValue,
            address,
            paymentMethod,
            paymentStatus,
            shipping,
            shippingMethod,
            status
        } = body;
        const order = await orderModel.findById(id);
        if (!order) {
            return {status: 404, message: "Không tìm thấy đơn hàng"};
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(id, {
            userId,
            orderDetailId,
            amount,
            description,
            voucherId,
            voucherValue,
            address,
            paymentMethod,
            paymentStatus,
            shipping,
            shippingMethod,
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