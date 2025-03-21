//connect collection categories
const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const objectId = schema.ObjectId;

const categorySchema = new mongoose.Schema({
    sku_id: { 
        type: String, 
        required: false
    },
    name: { type: String, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.category || mongoose.model('category', categorySchema);