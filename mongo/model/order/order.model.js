const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema({
    userId: {type: ObjectId, ref: "user", required: true},
    orderDetailId: {type: ObjectId, ref: "orderDetail", required: true},
    amount: {type: Number, required: true},
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",
    },
}, {timestamps: true});

const STATUS_FLOW = {
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: []
};

orderSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();  // Lấy dữ liệu cần cập nhật

    if (update.status !== undefined) {  // Kiểm tra nếu `status` có trong update
        const order = await this.model.findOne(this.getQuery()); // Lấy đơn hàng hiện tại
        if (order) {
            const currentStatus = order.status;
            const newStatus = update.status;

            if (currentStatus === newStatus) {
                console.log("⚠ Trạng thái không thay đổi, bỏ qua kiểm tra.");
                return next();
            }

            if (!STATUS_FLOW[currentStatus].includes(newStatus)) {
                return next(new Error(`Không thể cập nhật trạng thái từ ${currentStatus} về ${newStatus}`));
            }
        }
    }
    next();
});


module.exports = mongoose.models.order || mongoose.model("order", orderSchema)