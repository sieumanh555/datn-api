//connect collection categories
const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const objectId = schema.ObjectId;

const voucherSchema = new mongoose.Schema(
  {
    sku_id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: false },
    type: { type: String, required: false },
    value: { type: String, required: false },
    status: { type: String, required: false },
  },
  { timestamps: true }
);

const disvoucherSchema = new mongoose.Schema(
  {
    nameCre: { type: String, required: true },
    discountLimit: { type: String, required: false },
  },
  { timestamps: true }
);
module.exports = {
  Voucher: mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema),
  Disvoucher: mongoose.models.Disvoucher || mongoose.model("Disvoucher", disvoucherSchema),
};

