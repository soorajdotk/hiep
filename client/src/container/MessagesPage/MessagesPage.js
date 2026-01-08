import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import './MessagesPage.css';
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useAuthContext } from '../../hooks/useAuthContext';
import { io } from 'socket.io-client';
import Notification from '../../components/Notification/Notification';

const MessagesPage = () => {
  const { user } = useAuthContext();
  const [messengers, setMessengers] = useState([]);
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const socket = useMemo(() => io("http://localhost:4000", {
    query: { username: user.username }
  }), []);

  const chatAreaRef = useRef(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const sender = user.username;
    const createdAt = new Date().toISOString();
    const updatedMessages = [...messages, { sender, content: message, createdAt }];
    setMessages(updatedMessages);
    socket.emit('private-message', { to: selectedMessenger.username, message});
    setMessage('');
  };

  useEffect(() => {
    socket.on("connect", () => console.log("Connected"));
    socket.on("receive-message", (data) => {
      const { from, message, timestamp} = data;
      setMessages(prevMessages => [...prevMessages, { sender: from, content: message, timestamp}]);
      setMessengers(prevMessengers => {
        const updatedMessengers = prevMessengers.map(messenger => {
          if (messenger.username === from) {
            return { ...messenger, lastMessageTime: timestamp };
          }
          return messenger;
        });
  
        // Reorder messengers based on last message time
        updatedMessengers.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });
  
        return updatedMessengers;
      });
      setNewMessage(message)
    });
  }, [socket]);

  useEffect(() => {
    const fetchMessengers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user/get-following/${user.username}`);
        if (!response.ok) throw new Error('Failed to fetch followers');
        const data = await response.json();
        setMessengers(data.following);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };
    fetchMessengers();
  }, [user]);

  useEffect(() => {
    if (selectedMessenger) {
      const fetchMessages = async () => {
        try {
          console.log("fetch", selectedMessenger.username)
          const response = await fetch(`http://localhost:4000/api/message/get-message/${user.username}/${selectedMessenger.username}`);
          if (!response.ok) throw new Error('Failed to fetch messages');
          const data = await response.json();
          console.log(data)
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedMessenger, user]);

  useEffect(() => {
    // Scroll to the bottom of the chat area when new messages are added
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessengerSelect = (messenger) => setSelectedMessenger(messenger);

  const filteredMessengers = messengers.filter(messenger =>
    messenger.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page">
      {newMessage && <Notification message={newMessage} onClose={() => setNewMessage(null)} />}
      <div className="messages-sidebar">
        <div className="search-container">
          <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='search-bar' />
          <FaSearch className='search-icon' size={20} />
        </div>
        <div className='messengers-list'>
          <ul>
            {filteredMessengers.map((messenger, index) => (
              <li key={index} className={selectedMessenger === messenger ? 'selected' : ''} onClick={() => handleMessengerSelect(messenger)}>
                {messenger && (
                  <div className='messenger'>
                    <img src={require(`../../images/${messenger.profilePicture}`)} alt={messenger.username} className='profile-picture' />
                    {/* <h5>{messenger.username}</h5> */}
                    <p>{messenger.fullName}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chat-area">
        {selectedMessenger ? (
          <div className="chat-header">
            <Link to={`/${selectedMessenger.username}`}>
              <img src={require(`../../images/${selectedMessenger.profilePicture}`)} alt={selectedMessenger.username} className='profile-picture' />
              {/* <h2>{selectedMessenger.username}</h2> */}
              {selectedMessenger && <p>{selectedMessenger.fullName}</p>}
            </Link>
          </div>
        ): (<p style={{ marginTop: 150, marginLeft: 150}}>{messengers.length>0? 'Select a user to start messaging.' : 'Follow users to start messaging.'} </p>)}
        <div className="chat-messages" ref={chatAreaRef}>
          {messages.map(({ sender, content, createdAt }, index) => (
            <div key={index} className="message"  style={sender== user.username ? {marginLeft: 350} : {}}>
              <p><strong>{sender == user.username ? 'You' : sender}</strong>: {content}</p>
              <span>{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
        {selectedMessenger && (
          <div className="chat-input">
            <input type="text" placeholder="Type your message..." value={message} onChange={e => setMessage(e.target.value)} />
            <IoSend size={28} style={{cursor: 'pointer'}} className='send-icon' onClick={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
