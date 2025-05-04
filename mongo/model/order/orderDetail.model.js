const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderDetailSchema = new Schema({
    items: [
        {
            productId: {type: ObjectId, ref: "product", required: true},
            // userId: { type: ObjectId, ref: "user", required: true },
            // orderId: { type: ObjectId, ref: "order", required: true },
            selectedColor: {type: String, required: true},
            selectedSize: {type: Number, required: true},
            quantity: {type: Number, required: true, default: 1},
            price: {type: Number, required: true}
        }
    ],
}, {timestamps: true});
module.exports = mongoose.models.orderDetail || mongoose.model("orderDetail", orderDetailSchema)