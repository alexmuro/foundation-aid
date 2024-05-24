import React, { useMemo, useState, useEffect }from 'react'
//import {isJson} from "~/utils/macros.jsx";
async function getData ({
   beds_code='',
   year='/img/header.png',
   }) {
  return {
      position,
      bgImg,
      bgClass,
      logo,
      title,
      subTitle,
      note
  }
}


export function Calculator () {
  
  return (
    <div className={`min-h-[300px] border bg-slate-100 p-2 rounded-md w-full flex ` }>
      <div className='text-xl font-bold'>Foundation Aid Calculator</div> 
    </div>
  )
}


const Edit = ({value, onChange, size}) => {
    
    // let cachedData = useMemo(() => {
    //     return value && isJson(value) ? JSON.parse(value) : {}
    // }, [value]);

    //console.log('Edit: value,', size)
   
    return (
      <div>
          <Calculator />
      </div>
    ) 

}

const View = ({value}) => {
    // if(!value) return ''
    // let data = typeof value === 'object' ?
    //     value['element-data'] : 
    //     JSON.parse(value)
    
    return <Calculator />
             
}

Edit.settings = {
    hasControls: true,
    name: 'ElementEdit'
}


export default {
    "name": 'Foundation Aid Calculator',
    "type": 'Graph',
    "variables": [
        { 
          name: 'beds_code',
          default: '',
        },
        { 
          name: 'year',
          default: '',
        },
        { 
          name:'note',
          default: '2023 Update',
        }
    ],
    getData,
    "EditComp": Edit,
    "ViewComp": View
}