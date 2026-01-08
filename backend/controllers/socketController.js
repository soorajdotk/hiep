const { Server } = require('socket.io');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

const connectedUsers = {};

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', async (socket) => {
    
    // Authenticate and retrieve username from the socket handshake query parameters
    const { username } = socket.handshake.query;
    console.log('a user connected: ', username);
    if (!username) {
      console.log('User is not authenticated. Disconnecting...');
      socket.disconnect(true);
      return;
    }

    // Add user to the connectedUsers object
    connectedUsers[username] = socket;
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('user disconnected', username);
      // Remove the disconnected user from the connectedUsers object
      delete connectedUsers[username];
    });

    // Handle private messages
    socket.on('private-message', async ({ to, message }) => {
      console.log('private')
      try {
        console.log("to..", to)
        console.log("from...", username)
        const recipient = await User.findOne({username: to})
        if (recipient) {
          // Get the socket connection of the recipient
          const recipientSocket = connectedUsers[to];
          if (recipientSocket) {
            // Emit the message to the recipient's socket connection
            console.log("Message sent..", message)
            const timestamp = new Date().toISOString();
            recipientSocket.emit('recieve-message', { from: username, message, timestamp });
          } else {
            console.log(`Recipient with username ${to} is not connected.`);
          }
          const newMessage = new Message({
            sender: username, // Store the sender's username
            recipient: to, // Store the recipient's username
            content: message // Store the message content
            });
      
          await newMessage.save(); // Save the message
        } else {
          console.log(`Recipient with username ${to} not found.`);
        }

      } catch (error) {
        console.error('Error sending private message:', error.message);
      }
    });
  });

  return io;
};
