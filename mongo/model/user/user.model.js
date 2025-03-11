//connect collection categories
const mongoose = require('mongoose');
const schema = mongoose.Schema;
// const objectId = schema.ObjectId;

const userSchema = new schema({
    id: {type: Number, required: true},
    fristName: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    hinhanh: {type: String, require: false},
    diachi: {type: String, require: true},
    ngaysinh: {type: String, require: true},
    gioitinh: {type: String, require: true, default: "Khong gioi tinh"},
    numberphone: {type: String, require: true},
    status: {type: String, require: true},
    role: {type: Number, required: false, default: 0}
}, { timestamps: true });

module.exports = mongoose.models.user || mongoose.model('user', userSchema);
