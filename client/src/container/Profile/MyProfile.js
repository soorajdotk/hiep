import React, { useEffect, useState } from 'react';
import './Profile.css'; 
import { useAuthContext } from '../../hooks/useAuthContext';
import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';
import ProfilePost from '../../components/Post/ProfilePost';


const MyProfile = () => {
  const { user } = useAuthContext()
  const profilePicture = user.profilePicture !== '' ? require(`../../images/${user.profilePicture}`) : " "
  const [isEditing, setIsEditing] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCloseEdit = () => {
    setIsEditing(false)
  }

  useEffect(() =>{

    const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${user.username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const json = await response.json();
      console.log(json)
      setUserPosts(json.userPosts)
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      // Handle the error accordingly, such as setting a default value for posts
    }
  };


    if (user){
      console.log(user)
      fetchPosts()
    }
  }, [user])

  return (
      <div className='profile-page'>
        <div className='profile-info'>
          {/* Display user profile information */}
          <div className='profile-avatar'>
            {/* User avatar */}
            <img src={profilePicture} alt={user.fullName} />
          </div>
          <div className='profile-details'>
            {/* User details */}
            <div className="profile-top">
              <h3>{user.username}</h3>
              <button onClick={handleEditClick}>Edit profile</button>
            </div>
            <p>{user.fullName}</p>
            <div className="profile-counts">
              <p>{userPosts.length} posts</p>
              <p>0 followers</p>
              <p>0 following</p>
            </div>
            <p>{user.bio}</p>
            {/* Other user information */}
          </div>
        </div>
        <div className="profile-posts">
          <ProfilePost userPosts={userPosts} setUserPosts={setUserPosts}/>
        </div>

        {isEditing && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseEdit}>&times;</span>
              <ProfileEdit user={user} setIsEditing={setIsEditing} />
            </div>
          </div>
        )}
    </div>
    )
};

export default MyProfile;
