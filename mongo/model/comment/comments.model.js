//connect collection categories
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const commentSchema = new mongoose.Schema({
    sky_id: { type: String, required: true },
    user:{
        type:{
            userID: {type: ObjectId, required: true},
            firstname: {type: String, required: false},
            lastname: {type: String, required: false},
        },
        required: true
    },
    product:{
        type:{
            productID: {type: ObjectId, required: true},
            productName: {type: String, required: false},
        },
        required: true
    },
    content: { type: String, required: true },
    like: { type: Number, required: true, default: 0 },
    dislike: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.comments || mongoose.model('comments', commentSchema);