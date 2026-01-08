import React from 'react';
import './Home.css';
import FeedPage from '../../components/FeedPage/FeedPage';

const Home = () => {
  return (
    <div>
      <div className="main-content">
        <section className='post-section'>
          <FeedPage/>
        </section>
        {/* <section className='profile-section'>
          <ProfileTab/>
        </section> */}
      </div>
    </div>
  );
};

export default Home;
