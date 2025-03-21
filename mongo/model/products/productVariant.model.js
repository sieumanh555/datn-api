const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const productVariantSchema = new Schema({
    productId: { type: ObjectId, ref: "product", required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: false }],
    status: { type: String, required: true},
});
module.exports = mongoose.models.productVariant || mongoose.model('productVariant',productVariantSchema)
