//connect collection categories
const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const objectId = schema.ObjectId;

const generateRandomId = () => Math.floor(1000 + Math.random() * 9000);

const categorySchema = new mongoose.Schema({
    sku_id: { 
        type: Number, 
        default: generateRandomId,
        unique: true,
        required: false
    },
    name: { type: String, required: true },
    status: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.models.category || mongoose.model('category', categorySchema);