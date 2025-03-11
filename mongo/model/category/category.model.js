//connect collection categories
const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const objectId = schema.ObjectId;

const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    parentId: { type: String, required: false },
    status: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.models.category || mongoose.model('category', categorySchema);