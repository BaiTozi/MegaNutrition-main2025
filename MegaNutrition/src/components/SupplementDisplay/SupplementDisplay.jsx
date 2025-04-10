import React, { useContext } from 'react'
import './SupplementDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import SupplementItem from '../SupplementItem/SupplementItem'


const SupplementDisplay = ({category}) => {

  const {sup_list} = useContext(StoreContext)

  return (
    <div className ='supplement-display' id='supplement-display'>
      <h2>Top Supplements near you</h2>
      <div className="sup-display-list">
        {sup_list.map((item, index)=>{
            return <SupplementItem key = {index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
        })}
      </div>
    </div>
  )
}

export default SupplementDisplay