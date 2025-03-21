const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    sku_id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    pricePromo: { type: Number, required: true },
    mota: { type: String, required: false },
    hinhanh: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    hot: { type: Number, required: true, default: 0 },
    view: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    sold: { type: Number, required: true, default: 0 },
    location: { type: String, required: true},
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
