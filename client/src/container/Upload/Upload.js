import React, { useEffect, useState } from 'react';
import './Upload.css'; 
import { Link } from 'react-router-dom'
import {RiImageAddLine} from 'react-icons/ri'
import { useAuthContext } from '../../hooks/useAuthContext';
import { GrSubtractCircle } from 'react-icons/gr';
import { IoIosAddCircleOutline } from 'react-icons/io';


const UploadPost = () => {
  const { user } = useAuthContext()
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [suggestions, setSuggestions] = useState([])


  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/product/products');
            if (response.ok) {
              const productsData = await response.json();
              setProducts(productsData);
            } else {
              console.error('Failed to fetch products');
            }
          } catch (error) {
            console.error('Network error:', error);
          }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value);
    fetchSuggestions(value)
  };

  const handleProductSelect = (productId) => {
    if(!selectedProduct){
      setSelectedProduct(productId);
    }
    // Add the selected product to the tag list
  };

  const handleProductUnSelect = () => {
    setSelectedProduct(null);
  }

  const fetchSuggestions = async(value) => {
    try {
      const response = await fetch(`http://localhost:4000/api/product/products/suggestions?search=${value}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data) // Update the state with fetched products
      console.log(suggestions)
    } catch (error) {
      console.error('Error fetching products:', error);
    } 
}


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleTagProductsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpload = async () => {
      const username = user.username
      const formData = new FormData();
      formData.append('image', image); // Assuming 'image' is the key for the image file
      formData.append('username', username);
      formData.append('caption', caption);
      formData.append('tags', selectedProduct)

    try {
      const response = await fetch('http://localhost:4000/api/posts/upload', {
        method: 'POST',
        body: formData
      });
      
      
      if (response.ok) {
        // Post successfully uploaded
        console.log('Post uploaded!');

        // Reset state after successful upload
        setImage(null);
        setCaption('');
        setSelectedProduct(null)
      } else {
        // Handle error
        console.error('Failed to upload post');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }
  };

  return (
    <div className="upload-page">
        <div className='upload-post'>
            <h2 className='upload-heading'>New Post</h2>
            <div className="upload-image">
                <label htmlFor='image-upload' className='image-upload-label'>
                    <RiImageAddLine className='image-icon' />
                    Upload Image
                </label>
                {image && <img src={URL.createObjectURL(image)} alt='Uploaded' className='uploaded-image' />}
                <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    name='image'
                    onChange={handleImageChange}
                />
            </div>
            <Link className='tag-products-link' onClick={handleTagProductsClick}>
                  Tag Products
              </Link>
            <div className="upload-details">
                <textarea
                    placeholder='Write a caption...'
                    value={caption}
                    onChange={handleCaptionChange}
                    name='caption'
                ></textarea>
                <button className='upload-button' onClick={handleUpload}>
                    Share
                </button>
            </div>
        </div>
        {isModalOpen && <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={handleCloseModal}>Close</button>
          <h2>Tag Products</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
          <div className="product-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="product-item">
                {suggestion.name} <IoIosAddCircleOutline size={20} onClick={() => handleProductSelect(suggestion.id)}/>

              </div>
            ))}
          </div>
          <div className="tag-list">
            <h3>Tagged Products:</h3>
                <div className="tag-item">
                <p>
                  {selectedProduct ? products.find(p => p._id === selectedProduct)?.name : 'No product selected'} 
                  {selectedProduct && <GrSubtractCircle onClick={handleProductUnSelect} />}
                </p>
                
                </div>
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default UploadPost;
