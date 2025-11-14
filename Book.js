const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  img: String,
  desc: String,
  rating: { type: Number, default: 0 },
  chapters: { type: Number, default: 1 }
  // Thêm các trường khác nếu bạn muốn
});

module.exports = mongoose.model('Book', bookSchema);