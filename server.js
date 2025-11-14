const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// === DÁN CHUỖI KẾT NỐI CỦA BẠN VÀO ĐÂY ===
// Thay <username>, <password> và tên DB (ví dụ: GocSachNhoDB)
const DB_CONNECT_STRING = process.env.DB_CONNECT_STRING;
// Kết nối Database
mongoose.connect(DB_CONNECT_STRING)
  .then(() => console.log('Đã kết nối thành công tới MongoDB Atlas!'))
  .catch(err => console.error('Lỗi kết nối DB:', err));

// Middlewares
app.use(cors());
app.use(express.json()); // Để xử lý JSON

// Sử dụng các routes API
app.use('/api', apiRoutes);

// API Test
app.get('/', (req, res) => {
  res.send('Backend Góc Sách Nhỏ đang chạy!');
});

const PORT = process.env.PORT || 3001; // Dùng cổng 3001
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});