const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  kyc_id: {type : String, required: true},
  firstname: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: false },
  image: { type: String, required: false },
  gender: { type: String, required: true },
  birthday: { type: String, required: true },
  status: { type: String, required: false, default: "On" },
  role: { type: Number, required: false, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
