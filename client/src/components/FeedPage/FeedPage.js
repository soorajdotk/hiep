import React, { useEffect, useState } from 'react'
import './FeedPage.css'
import Post from '../Post/Post'
import { useAuthContext } from '../../hooks/useAuthContext'

const FeedPage = () => {
    const [feedPosts, setFeedPosts] = useState([])
    const { user } = useAuthContext()
    const username = user.username

    useEffect(() => {
        const fetchFeedPosts = async () => {
          try {
            const response = await fetch(`http://localhost:4000/api/user/feed/${username}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFeedPosts(data.feed);
          } catch (error) {
            console.error('Error fetching feed posts:', error);
          }
        };
    
        fetchFeedPosts();
      }, []);
  return (
    <div>
        <div>
            {feedPosts.map(post => (
                <div key={post._id} className='post'>
                    <Post post={post} user={user}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default FeedPage
