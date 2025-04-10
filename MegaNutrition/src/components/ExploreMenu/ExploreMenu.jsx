import React from 'react'
import './ExploreMenu.css'
import { supplements_list } from '../../assets/assets'


const ExploreMenu = ({category,setCategory}) => {

  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our supplements</h1>
        <p className='explore-menu-text'>Choose from a diverse supplements.Оur mission is to satisfy your cravings and elevate your experience  in the fitness environment</p>
        <div className="explore-menu-list">
            {supplements_list.map((item,index)=>{
                return(
                    <div onClick={()=>setCategory(prev=>prev===item.sup_name?"All":item.sup_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.sup_name?"active":"vite"} src={item.sup_image} alt="" />
                        <p>{item.sup_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu