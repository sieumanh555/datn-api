const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    sku_id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    pricePromo: { type: Number, required: true },
    mota: { type: String, required: false },
    image: { type: String, required: false },
    quantity: { type: Number, required: true, default: 0 },
    status: { type: String, required: false, default: "available" },
    category: {
        type: {
            categoryId: { type: ObjectId, required: true },
            categoryName: { type: String, required: true },
        },
        required: true
    },
    variants: [{ type: ObjectId, ref: "productVariant" }]
}, { timestamps: true });

module.exports = mongoose.models.product || mongoose.model('product', productSchema);
