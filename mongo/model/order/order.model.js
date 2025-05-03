const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

module.exports = async () => {
    const { customAlphabet } = await import("nanoid");
    const generateKey = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

    const orderSchema = new Schema({
        uniqueKey: { type: String, default: () => generateKey() },
        userId: { type: ObjectId, ref: "user", required: true },
        orderDetailId: { type: ObjectId, ref: "orderDetail", required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: false, default: "" },
        voucherId: { type: ObjectId, ref: "Voucher", required: true },
        voucherValue: { type: Number, required: false, default: 0 },
        address: { type: String, required: true },
        paymentMethod: { type: String, required: true },
        paymentStatus: {
            type: String,
            enum: ["Uncompleted", "Completed"],
            default: "Uncompleted"
        },
        shipping: { type: Number, required: true },
        shippingMethod: { type: String, required: false },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Shipping", "Cancelled"],
            default: "Processing",
        },
    }, { timestamps: true });

    const PAYMENT_STATUS_FLOW = {
        Uncompleted: ["Completed"],
        Completed: []
    }
    const STATUS_FLOW = {
        Processing: ["Shipped", "Cancelled"],
        Shipped: ["Delivered"],
        Delivered: [],
        Cancelled: []
    };

    orderSchema.pre("findOneAndUpdate", async function (next) {
        const update = this.getUpdate();  // Lấy dữ liệu cần cập nhật
        const order = await this.model.findOne(this.getQuery()); // Lấy đơn hàng hiện tại

        if (update.status !== undefined) {    // Kiểm tra nếu `status` có trong update
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

        if (update.paymentStatus !== undefined) {    // Kiểm tra nếu `status` có trong update
            if (order) {
                const currentPaymentStatus = order.paymentStatus;
                const newPaymentStatus = update.paymentStatus;

                if (currentPaymentStatus === newPaymentStatus) {
                    console.log("⚠ Trạng thái không thay đổi, bỏ qua kiểm tra.");
                    return next();
                }

                if (!PAYMENT_STATUS_FLOW[currentPaymentStatus].includes(newPaymentStatus)) {
                    return next(new Error(`Không thể cập nhật trạng thái từ ${currentPaymentStatus} về ${newPaymentStatus}`));
                }
            }
        }
        next();
    });

    return mongoose.models.order || mongoose.model("order", orderSchema);
};