import jwt from 'jsonwebtoken';

// Secret key, thường được lưu trong biến môi trường (env)
const secretKey = 'mysecretkey';

// Dữ liệu mẫu để mã hoá vào JWT
const userData = {
  id: "123",
  username: 'john_doe',
  role: 'user',
};

// Tạo JWT
const token = jwt.sign(userData, secretKey, { expiresIn: '1h' });


// Xác thực JWT
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    console.error('JWT verification failed:', err.message);
  } else {
    console.log('Decoded JWT:');
    console.log(decoded);
  }
});