require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const verifyToken = require('./middleware/verifyToken');

const app = express();

app.use('/register', createProxyMiddleware({
  target: process.env.REGISTER_SERVICE_URL,
  changeOrigin: true
}));

app.use('/auth', createProxyMiddleware({
  target: process.env.LOGIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/': '/auth/' }
}));

app.use('/admin', verifyToken('admin'), createProxyMiddleware({
  target: process.env.ADMIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/': '/admin/' }
}));

app.use('/user', verifyToken('user'), createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/': '/user/' }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});