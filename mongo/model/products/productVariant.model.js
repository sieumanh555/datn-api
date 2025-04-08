const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const productVariantSchema = new Schema({
    productId: { type: ObjectId, ref: "product", required: true },
    size: { type: String, required: false },
    color: { type: String, required: false },
    price: { type: Number, required: false },
    stock: { type: Number, required: false, default: 0 },
    images: [{ type: String, required: false }],
    status: { type: String, required: false, default: "Cho"},
});
module.exports = mongoose.models.productVariant || mongoose.model('productVariant',productVariantSchema)
