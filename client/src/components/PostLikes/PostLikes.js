import React, { useState, useEffect } from 'react';

const PostLikes = ({likers, onClose}) => {
    const [likersData, setLikersData] = useState([])

    useEffect(() => {
        const fetchLikersData = async () => {
            try {
              const likersDataPromises = likers.map(async liker => {
                const response = await fetch(`http://localhost:4000/api/user/${liker}`, {
                  method: "GET",
                });
      
                if (!response.ok) {
                  throw new Error(`Failed to fetch data for ${liker}`);
                }
      
                const data = await response.json();
                return data;
              });
              const fetchedLikersData = await Promise.all(likersDataPromises);
                setLikersData(fetchedLikersData);
                console.log(likersData)
            } catch (error) {
                console.error("Error fetching likers data:", error);
            }
            fetchLikersData()
        }
    }, [likers])
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Likes</h2>
        <ul>
          {likersData.map((likerData, index) => (
            <li key={index}>
                {likerData ? likerData.username : "Unknown user"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostLikes;
