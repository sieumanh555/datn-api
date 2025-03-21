//connect collection categories
const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const objectId = schema.ObjectId;

const supplierSchema = new mongoose.Schema({
    sku_id: { type: String, required: true },
    name: { type: String, required: true },
    diachi: { type: String, required: false },
    numberphone: { type: String, required: false },
    email: { type: String, required: false },
    contactName: { type: String, required: false },
    taxCode: { type: String, required: false },
    type: { type: String, required: false },
    status: { type: String, required: false }
},);

module.exports = mongoose.models.supplier || mongoose.model('supplier', supplierSchema);