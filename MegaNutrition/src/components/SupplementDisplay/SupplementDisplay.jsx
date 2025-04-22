import React, { useContext } from 'react';
import './SupplementDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import SupplementItem from '../SupplementItem/SupplementItem';

const SupplementDisplay = ({ category }) => {
  const { products } = useContext(StoreContext);

  // Покажи "Loading..." докато продуктите се заредят
  if (!products) {
    return <div className="supplement-display">Loading supplements...</div>;
  }

  const filteredProducts = category
    ? products.filter((item) => item.category === category)
    : products;

  return (
    <div className="supplement-display" id="supplement-display">
      <h2>Top Supplements near you</h2>
      <div className="sup-display-list">
        {filteredProducts.map((item) => (
          <SupplementItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.imageURL}
          />
        ))}
      </div>
    </div>
  );
};

export default SupplementDisplay;
