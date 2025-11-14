const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');

const router = express.Router();

const JWT_SECRET = "admin1234"; // Thay đổi chuỗi này

// === API ĐĂNG KÝ ===
router.post('/register', async (req, res) => {
  try {
    const { name, user, email, phone, pass } = req.body;

    // Kiểm tra
    if (!name || !user || !email || !phone || !pass) {
      return res.json({ success: false, message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    let existing = await User.findOne({ $or: [{ username: user }, { email: email }] });
    if (existing) {
      return res.json({ success: false, message: 'Tên đăng nhập hoặc email đã tồn tại.' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const newUser = new User({
      name,
      username: user,
      email,
      phone,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
    });

    await newUser.save();
    res.json({ success: true, message: 'Đăng ký thành công!' });

  } catch (err) {
    res.json({ success: false, message: 'Lỗi máy chủ.' });
  }
});

// === API ĐĂNG NHẬP ===
router.post('/login', async (req, res) => {
  try {
    const { user, pass } = req.body;
    const foundUser = await User.findOne({ $or: [{ username: user }, { email: user }] });

    if (!foundUser) {
      return res.json({ success: false, message: 'Sai thông tin đăng nhập.' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(pass, foundUser.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Sai thông tin đăng nhập.' });
    }

    // Tạo "Vé" (Token)
    const tokenPayload = {
        userId: foundUser._id,
        username: foundUser.username,
        isAdmin: foundUser.isAdmin
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
        success: true, 
        message: 'Đăng nhập thành công!',
        token: token, // Gửi "vé" về cho frontend
        user: { // Gửi thông tin user (trừ mật khẩu)
            name: foundUser.name,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin
        }
    });

  } catch (err) {
    res.json({ success: false, message: 'Lỗi máy chủ.' });
  }
});

// === API LẤY SÁCH (TRANG CHỦ) ===
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().limit(20); // Lấy 20 cuốn
        res.json({ success: true, data: books });
    } catch (err) {
        res.json({ success: false, message: 'Lỗi khi tải sách.' });
    }
});

// === (TỰ THÊM) TẠO MỘT SÁCH ĐỂ TEST ===
// Bạn chỉ cần gọi link này 1 lần để tạo data mẫu
router.get('/create-dummy-book', async (req, res) => {
    try {
        const book = new Book({
            title: 'Harry Potter và Hòn Đá Phù Thủy',
            author: 'J.K. Rowling',
            genre: 'Tiểu thuyết',
            img: 'https://via.placeholder.com/300x450/8BAC6A/FFFFFF?text=Sach+1',
            desc: 'Mô tả chi tiết sách mẫu...',
            rating: 5,
            chapters: 17
        });
        await book.save();
        res.json({ success: true, message: 'Tạo sách mẫu thành công!'});
    } catch (err) {
        res.json({ success: false, message: 'Lỗi tạo sách.'});
    }
});

module.exports = router;