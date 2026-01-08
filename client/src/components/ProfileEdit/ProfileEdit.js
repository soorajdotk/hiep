// ProfileEditForm.js

import React, { useState } from 'react';
import './ProfileEdit.css'; // Import the CSS file
import { useUpdate } from '../../hooks/useUpdate';
import { useAuthContext } from '../../hooks/useAuthContext';
import { RiImageAddLine } from 'react-icons/ri';

function ProfileEdit() {
  const { user } = useAuthContext()
  const { update } = useUpdate()
  const [fullName, setFullName] = useState(user.fullName || '');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [bio, setBio] = useState(user.bio || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await update(fullName, profilePicture, bio)
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]
    if(selectedImage){
      setProfilePicture(selectedImage)
    }
  }

  return (
    <form className="formContainer" onSubmit={handleSubmit}>
      <label className="label">
        Full Name:
        <input
          className="inputField"
          type="text"
          placeholder={user.fullName}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </label>
      <label className="image-upload-label">
      <RiImageAddLine className='image-icon' />
      Profile Picture
        <input
          className=""
          type="file" // Change input type to accept files
          accept='image/*'
          onChange={handleImageChange} // Handle file change
        />
      </label>
      <label className="label">
        Bio:
        <textarea
          className="textareaField"
          placeholder={user.bio}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </label>
      <button type="submit" className="submitButton">
        Save Changes
      </button>
    </form>
  );
}

export default ProfileEdit;
