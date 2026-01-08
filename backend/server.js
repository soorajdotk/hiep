require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const accountRoutes = require('./routes/account');
const messageRoutes = require('./routes/message');
const socketController = require('./controllers/socketController')

// express app
const app = express();
const server = http.createServer(app);
// const io = new socketio.Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods:["GET", "POST"],
//     credentials: true
//   }
// });

// io.on("connect", (socket) => {
//   console.log("User connected", socket.id, socket.handshake.query.username)

//   socket.on("message", ({ room, message }) => {
//     console.log({ room, message })
//     io.to(room).emit("receive-message", message)
//   })

//   socket.on('join-room', (room) => {
//     socket.join(room)
//     console.log(`User joined room ${room}`)
//   })

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id)
//   })
// });

const io = socketController(server);

app.use(cors({
  origin: 'http://localhost:3000',
  methods:["GET","POST","PATCH","PUT","DELETE"]
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/message', messageRoutes);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    server.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
