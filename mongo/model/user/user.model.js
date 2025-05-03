const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  kyc_id: {type : String, required: true},
  firstname: { type: String, required: false },
  name: { type: String, required: true },
  lastname: { type: String, required: false },
  phone: { type: String, required: false, default: "+00-000000000" },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: false, default: "Chưa có" },
  image: { type: String, required: false, default: "https://i.pinimg.com/736x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg" },
  gender: { type: String, required: false, default: "Chưa có" },
  birthday: { type: String, required: false, default: "00/00/0000" },
  status: { type: String, required: false, default: "On" },
  role: { type: Number, required: false, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
