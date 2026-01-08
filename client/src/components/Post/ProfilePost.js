import React, { useEffect, useRef, useState } from 'react'
import './ProfilePost.css'
import { useAuthContext } from '../../hooks/useAuthContext';
import Post from './Post';
import { useParams } from 'react-router-dom';


const ProfilePost = () => {
  const { user } = useAuthContext()
  const { username } = useParams()
  const [userPosts, setUserPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const modalRef = useRef(null)

  useEffect(() => {
    fetchPosts()
  }, [username])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setUserPosts(data.userPosts)
    } catch(error) {
      console.error('Error fetching posts:', error.message);
      // Handle the error accordingly, such as setting a default value for posts
    }
  };
  
  const handlePostClick = (post) => {
    setSelectedPost(post)
  }


  const handleClosePostDetails = () => {
    setSelectedPost(null);
    fetchPosts()
  };

  const handleDeletePost = (postId) => {
    setSelectedPost(null)
    setUserPosts(userPosts.filter(post => post._id !== postId))
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && modalRef.current.contains(event.target)) {
      handleClosePostDetails()
    }
  };

  return (
    <div className='post'>
      <div className="posts">
        {userPosts && userPosts.map((post) => (
              <div key={post._id} className="post-item" onClick={() => handlePostClick(post)}>
                <img src={require(`../../images/${post.image}`)} alt={post.caption} className='post-image' /> 
              </div>
            ))}
      </div>
          {/* Modal for displaying post details */}
        {selectedPost && (
          <div className="modal">
            <div className="modal-content" >
              <span className="close" onClick={handleClosePostDetails}>&times;</span>
              <Post post={selectedPost} onDelete={handleDeletePost}  ref={modalRef}/>
            </div>
          </div>
        )}
    </div>

    
  )
}

export default ProfilePost
