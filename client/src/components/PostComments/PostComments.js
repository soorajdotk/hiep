import React, { useState, useEffect } from 'react';
import { BsFillSendPlusFill } from "react-icons/bs";
import './Postcomments.css'

const PostComments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const username = user.username

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  useEffect(() => {

    fetchComments();
  }, [postId]);

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };


  const handleAddComment = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, content: newComment }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <div className="comment-input-container">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleNewCommentChange}
          className="comment-input"
        />
        <BsFillSendPlusFill onClick={handleAddComment} size={25} className="add-comment-icon" />
      </div>
      <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            <p><strong>{comment.username}</strong>: {comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
