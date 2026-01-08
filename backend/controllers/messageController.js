const Message = require('../models/messageModel')

const getMessage = async(req, res) => {
    const { sender, recipient } = req.params
    try {
        // Find messages where sender is 'sender' and receiver is 'receiver'
        const messages = await Message.find({ 
            $or: [
                { sender, recipient },
                { sender: recipient, recipient: sender } // In case messages are sent from 'receiver' to 'sender'
            ]
        });

        // console.log(messages)
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getLastMessage = async(req, res) => {
    const { sender, recipient } = req.params
    try {
        // Find the last message between sender and recipient
        const lastMessage = await Message.findOne({ 
            $or: [
                { sender, recipient },
                { sender: recipient, recipient: sender }
            ]
        }).sort({ createdAt : -1}); // Sort by timestamp in descending order to get the latest message

        if (!lastMessage) {
            return
        }

        res.status(200).json(lastMessage);
    } catch (error) {
        console.error('Error fetching last message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getMessage,
    getLastMessage
}