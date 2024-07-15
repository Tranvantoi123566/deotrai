const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Cấu hình kết nối MySQL

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12719572', // thay bằng tên người dùng MySQL của bạn
  password: 'vRMXCSE1YX', // thay bằng mật khẩu MySQL của bạn

  database: 'sql12719572' // Thay bằng tên cơ sở dữ liệu hiện có của bạn
});

// Kết nối tới MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Phục vụ các tệp tĩnh
app.use(express.static('public'));

// Trang chủ hiển thị form đăng ký và đăng nhập
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Xử lý yêu cầu đăng nhập từ form
app.post('/login', (req, res) => {
  const username = req.body.loginUsername;
  const password = req.body.loginPassword;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (result.length > 0) {
      // Nếu đăng nhập thành công, lưu dữ liệu vào MySQL
      const sqlInsert = 'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE username=?, password=?';
      db.query(sqlInsert, [username, password, username, password], (err, result) => {
        if (err) {
          return res.status(500).send('Database error');
        }
        res.send('Login successful and data saved to MySQL');
      });
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
