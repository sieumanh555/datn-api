const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  kyc_id: {type : String, required: true},
  firstname: { type: String, required: false },
  name: { type: String, required: true },
  lastname: { type: String, required: false },
  phone: { type: String, required: false, default: "00-00-0000" },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: false, default: "Chưa có" },
  image: { type: String, required: false },
  gender: { type: String, required: false, default: "Chưa có" },
  birthday: { type: String, required: false, default: "Chứa có" },
  status: { type: String, required: false, default: "On" },
  role: { type: Number, required: false, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
