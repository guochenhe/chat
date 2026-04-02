const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// 让服务器自动托管静态文件（关键修复）
app.use(express.static(path.join(__dirname)));

// 访问根目录自动打开聊天页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 聊天逻辑
io.on('connection', (socket) => {
  console.log('用户已连接：', socket.id);

  socket.on('sendMsg', (msg) => {
    io.emit('newMsg', msg);
  });

  socket.on('disconnect', () => {
    console.log('用户断开：', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('✅ 服务器启动成功：http://localhost:' + PORT);
});