import React from 'react'
import {GiEmptyHourglass} from "react-icons/gi"

const Empty = () => {
  return (
    <div id='empty'>
        <GiEmptyHourglass className='icon'/>
        <h5>Empty</h5>
    </div>
  )
}

export default Empty