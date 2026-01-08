import React, { useState } from 'react';
import './ProductForm.css'; // Import the CSS file
import { useAuthContext } from '../../hooks/useAuthContext';
import { RiImageAddLine } from 'react-icons/ri';

const ProductForm = () => {
  const{ user } = useAuthContext()
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('')
  const [productQuantity, setProductQuantity] = useState(0)
  const [productImage, setProductImage] = useState(null); // State to store the selected image file

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle form submission, such as sending data to the backend
    // For example, you can make a POST request to add the product to your database
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('category', productCategory);
    formData.append('description', productDescription);
    formData.append('quantity', productQuantity);
    formData.append('image', productImage);
    // Example: Make a POST request to add the product
    fetch(`http://localhost:4000/api/product/${user.username}/product`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        // Handle success, e.g., show a success message to the user
        console.log('Product added successfully');
      })
      .catch(error => {
        // Handle error, e.g., show an error message to the user
        console.error('Error adding product:', error);
      });
    // Reset form fields after submission
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setProductCategory(null)
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setProductImage(selectedImage);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add New Product</h2>
        <div>
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="productPrice">Price:</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(event) => setProductPrice(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="productCategory">Product Category:</label>
          <input
            type="text"
            id="productCategory"
            value={productCategory}
            onChange={(event) => setProductCategory(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="productQuantity">Product Quantity:</label>
          <input
            type="number"
            id="productQuantity"
            value={productQuantity}
            onChange={(event) => setProductQuantity(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="productDescription">Description:</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(event) => setProductDescription(event.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor='image-upload' className='image-upload-label'>
            <RiImageAddLine className='image-icon' />
            Upload Image
        </label>
        {productImage && <img src={URL.createObjectURL(productImage)} alt='Uploaded' className='uploaded-image' />}
        <input
            id='image-upload'
            type='file'
            accept='image/*'
            name='image'
            onChange={handleImageChange}
        />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
