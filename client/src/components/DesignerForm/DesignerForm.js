import React, { useState } from 'react';
import './DesignerForm.css';
import { useAuthContext } from '../../hooks/useAuthContext';

const DesignerForm = ({handleCloseForm}) => {

  const { user } = useAuthContext()
  const [ isSubmitted , setIsSubmitted] = useState(false)
  const [ isError, setIsError] = useState(false)
  const [error, setError] = useState()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    designSkills: '',
    achievements: '',
    additionalComments: '',
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name] : value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., send data to the server
    console.log(formData);
    try{
      const response = await fetch(`http://localhost:4000/api/user/${user.username}/switch-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        const err = await response.json()
        console.log(err)
        setIsError(true)
        setError(err.message)
        setTimeout(() => setIsError(false), 5000)
      }else{
      // Optionally, you can handle success response here
        console.log('Form submitted successfully');
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          handleCloseForm()
        }, 3500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <label>
          Full Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Phone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </label>

        {/* Design Skills */}
        <label>
          Design Skills:
          <textarea
            name="designSkills"
            value={formData.designSkills}
            onChange={handleChange}
            />
        </label>

        {/* Additional Comments */}
        <label>
          Additional Comments:
          <textarea
            name="additionalComments"
            value={formData.additionalComments}
            onChange={handleChange}
            />
        </label>

        <button type="submit">Submit</button>
        {isSubmitted && <div className='popup'>Switched to Designer!!! Please Re-login.</div>}
        {isError && <div className='popup'>{error}</div>}
      </form>
    </div>
  );
};

export default DesignerForm;
