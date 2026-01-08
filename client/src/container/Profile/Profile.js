import React, { useEffect, useState} from 'react';
import './Profile.css'; 
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link, useParams } from 'react-router-dom';
import ProfilePost from '../../components/Post/ProfilePost';
import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';
import DesignerForm from '../../components/DesignerForm/DesignerForm';

const Profile = () => {
  const { user } = useAuthContext()
  const { username } = useParams()
  const[currentUser, setCurrentUser] = useState(null)
  const[isFollowing, setIsFollowing] = useState(false)
  const[editProfile, setEditProfile] = useState(false)
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followingOver, setFollowingOver] = useState(false)
  const [showDesignerForm, setShowDesignerForm] = useState(false)


  useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/user/${username}`, {
            method: "GET",
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const data = await response.json();
          console.log(data)
          setCurrentUser(data);
        } catch (error) {
          console.error("Error: ", error);
        }
      };
      fetchUser()

      const fetchFollowStatus = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/user/check-follow/${username}?currentUserUsername=${user.username}`, {
            method: 'GET',
          });
          const data = await response.json();
          setIsFollowing(data.isFollowing);
          setFollowersCount(data.followersCount || 0);
          setFollowingCount(data.followingCount || 0);
          console.log(isFollowing, followersCount, followingCount)
        } catch (error) {
          console.error('Error fetching follow status:', error);
        }
      };
  
      fetchFollowStatus();

  }, [username]);

  const handleEditProfile = () =>{
    setEditProfile(true)
  }
  
  const handleCloseEdit = () => {
    setEditProfile(false)
  }

  const handleFollowClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/follow/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerUsername: user.username})
      });
      if (response.ok) {
        setIsFollowing(true);
      } else {
        console.error('Failed to follow user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUnfollowClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/unfollow/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerUsername: user.username})
      });
      if (response.ok) {
        setIsFollowing(false);
      } else {
        console.error('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFollowingOver = async() => {
    setFollowingOver(true)
  }

  const handleSwitchToDesigner = () => {
    setShowDesignerForm(true);
  };

  const handleCloseDesignerForm = () => {
    setShowDesignerForm(false);
  };

  

  const profilePicture = currentUser && currentUser.profilePicture !== '' ? require(`../../images/${currentUser.profilePicture}`) : null

  return (
      <div className='profile-page'>
        <div className='profile-info'>
          <div className='profile-avatar'>
            <img src={profilePicture} alt={(currentUser && currentUser.fullName )|| ' '} />
          </div>
          <div className='profile-details'>
            <div className="profile-top">
              <h3>{currentUser && currentUser?.username || ' '}</h3>
              {currentUser?.username !== user.username && (
                !isFollowing ? (
                  <div>
                    <button onClick={handleFollowClick}>Follow</button>
                    <Link to={`/portfolio/${currentUser?.username}`}>{currentUser && currentUser.role =='designer' &&<button>Portfolio</button>}</Link>
                  </div>
                ) : ( !followingOver?(
                  <div>
                    <button className='unfollow' onClick={handleUnfollowClick} onMouseEnter={handleFollowingOver}>Following</button>
                    <Link to={`/portfolio/${currentUser?.username}`}>{currentUser && currentUser.role =='designer' && <button>Portfolio</button>}</Link>
                  </div>
                ):(
                  <div>
                    <button className='unfollow' onClick={handleUnfollowClick} onMouseLeave={(e) => setFollowingOver(false)}>Unfollow</button>
                    <Link to={`/portfolio/${currentUser?.username}`}>{currentUser && currentUser.role =='designer' && <button>Portfolio</button>}</Link>
                  </div>
                )
                )
              )}
              {currentUser?.username === user.username && (
                <div>
                  <button onClick={handleEditProfile} className='edit'>Edit Profile</button>
                  {currentUser && currentUser.role =='user' ? <button onClick={handleSwitchToDesigner}>Switch to designer</button> : <Link to={`/portfolio/${currentUser.username}`}><button>Portfolio</button></Link>}
                </div>
              )}
            </div>
            <p>{currentUser &&currentUser.fullName}</p>
            <div className="profile-counts">
              <p>{(currentUser && currentUser.posts.length )|| 0} posts</p>
              <p>{followersCount} followers</p>
              <p>{followingCount} following</p>
            </div>
            <p>{(currentUser && currentUser.bio )|| ' '}</p>
          </div>
        </div>
        <div className="profile-posts">
          <ProfilePost/>
        </div>
        {editProfile && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseEdit}>&times;</span>
              <ProfileEdit user={user} setEditProfile={editProfile} />
            </div>
          </div>
        )}
        {showDesignerForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseDesignerForm}>&times;</span>
              <DesignerForm user={user} setEditProfile={showDesignerForm} handleCloseForm ={handleCloseDesignerForm}/>
            </div>
          </div>
        )}
    </div>
    )
};

export default Profile;
