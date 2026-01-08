import React, { useEffect, useState } from 'react';
import './PortfolioPage.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link, useParams } from 'react-router-dom';

const PortfolioPage = () => {
    const { username } = useParams()
  const [designer, setDesigner] = useState(null)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDesignerDetails = async() => {
      try{
        const response = await fetch(`http://localhost:4000/api/user/${username}/designer-details`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch designer details');
        }
        
        const data = await response.json();
        console.log('Designer details:', data);
        setDesigner(data)
        // Handle the received designer details here
      } catch (error) {
        console.error('Error fetching designer details:', error);
        // Handle error
      }
    }
    
    fetchDesignerDetails()
  }, [])
  
  
    useEffect(() => {
      const fetchMyProducts = async () => {
        try {
          // Make a request to fetch products posted by the current designer (user)
          const response = await fetch(`http://localhost:4000/api/product/my-products/${username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          setProducts(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchMyProducts();
    }, []);


  const profilePicture = designer && designer.profilePicture !== '' ? require(`../../images/${designer.profilePicture}`) : null
  
  
    if (loading) {
      return <div>Loading...</div>;
    }
  return (
    <div className="portfolio-page">
    {designer && 
      <div className="portfolio-header">
        <div className="profile-avatar">
          <img src={profilePicture} alt={designer.username} />
        </div>
        <div className="portfolio-details">
          <h2>{designer.fullName}</h2>
          <p>{designer.email}</p>
          <p>{designer.phone}</p>
          <p>{designer.designSkills}</p>
          <p>{designer.additionalComments}</p>
        </div>
      </div>
}

  <div className="my-product-list">
  {products.map((product) => (
    <div key={product._id} className="my-product">
      {/* <div className='my-product-edit'>
          <MdModeEdit className='edit-btn'/>
      </div> */}
      <img src={require(`../../images/${product.image}`)} alt={product.name} className="my-product-image" />
      <Link to={`/product/${product._id}`}><div className="my-product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>Price: ₹{product.price}</h3>
      </div>
      </Link>
  </div>
  ))}
  </div>
    {/* //   <div className="portfolio-projects">
    //     <h3>Design Projects</h3>
    //     <ul>
    //       {designer.projects.map((project, index) => (
    //         <li key={index}>
    //           <h4>{project.title}</h4>
    //           <p>{project.description}</p>
    //         </li>
    //       ))}
    //     </ul>
    //   </div> */}
    </div>
  );
};

export default PortfolioPage;
