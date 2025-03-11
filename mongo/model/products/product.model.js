const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const productSchema = new Schema({
    id: {type: Number, required: false},
    name: {type: String, required: false},
    price: {type: Number, required: false},
    pricePromo: {type: Number, required: false},
    image: {type: Number, required: false},
    mota: {type: String, required: false},
    category:{
        type:{
            categoryId: {type: ObjectId, required: true},
            categoryName: {type: String, required: true},
        },
        required: true
    },
    status: {type: String, required: false},
    variants: [{ type: ObjectId, ref: "productVariant" }]
}, { timestamps: true });

module.exports = mongoose.models.product || mongoose.model('product',productSchema)