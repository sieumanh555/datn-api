//connect collection categories
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: false },
    image: { type: String, required: false },
    imageChild: [{ type: String, required: false }],
    status: { type: String, required: false },
    category:{
        type:{
            categoryId: {type: ObjectId, required: true},
            categoryName: {type: String, required: true},
        },
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.models.news || mongoose.model('news', newsSchema);