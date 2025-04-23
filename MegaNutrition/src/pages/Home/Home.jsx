import React from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import { useState } from 'react';
import SupplementDisplay from '../../components/SupplementDisplay/SupplementDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <div id="supplements">
        <SupplementDisplay category={category} />
      </div>
      <AppDownload />
    </div>
  );
};

export default Home;
