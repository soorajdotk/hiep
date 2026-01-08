import React, { useEffect, useState } from 'react'
import './ProfileBlock.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'

const ProfileBlock = ({designer}) => {
    const { user } = useAuthContext()
    const [designerDetails, setDesignerDetails] = useState(null)
    const [ isFollowing, setIsFollowing] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchUser = async () => {
        try {
        const response = await fetch(`http://localhost:4000/api/user/${designer}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data)
        setDesignerDetails(data);
        setLoading(false);
        } catch (error) {
        console.error("Error: ", error);
        }
    };
    fetchUser()

    const fetchFollowStatus = async () => {
        try {
        const response = await fetch(`http://localhost:4000/api/user/check-follow/${designer}?currentUserUsername=${user.username}`, {
            method: 'GET',
        });
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        } catch (error) {
        console.error('Error fetching follow status:', error);
        }
    };

    fetchFollowStatus();

    }, [designer]);
    // Function to handle follow button click
    const handleFollowClick = () => {
        // Implement functionality to handle follow action
    };

    if (loading) {
        return <div>Loading...</div>; // Render loading indicator while fetching product
    }

    if (!designerDetails) {
        return <div>No product found.</div>; // Handle case where product is not found
    }

    const profilePicture = designerDetails && designerDetails.profilePicture !== '' ? require(`../../images/${designerDetails.profilePicture}`) : null

    return (
        <div className="profile-tab">
            <Link to={`/${designer}`}>
            <div className="profile-tab-info">
                <img src={profilePicture} alt="Profile" className="profile-tab-profile-picture" />
                <div>
                    <p className="name">{designerDetails.fullName}</p>
                    <p className="username">@{designerDetails.username}</p>
                </div>
            </div>
            </Link>
            <Link className="follow-button" onClick={handleFollowClick}></Link>
        </div>
    );
}

export default ProfileBlock
