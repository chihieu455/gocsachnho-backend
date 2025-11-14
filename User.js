const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // Sẽ mã hóa sau
  isAdmin: { type: Boolean, default: false }
  // Thêm các trường khác của bạn (favorites, borrows...)
});

module.exports = mongoose.model('User', userSchema);