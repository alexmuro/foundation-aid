import React, { useMemo, useState, useEffect }from 'react'
import  papa  from "papaparse";
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
  const beds_code = '010201'

  const [sourceData, setSourceData] = useState({
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    H: [],
    I: [],
    J: [],
    K: []
  })
 
  useEffect(() => {
    const loadData = async () => {
      console.log('loadData')
      let res = await fetch('/data/DOB-FA-A.csv')
      let csv = await res.text()
      let a_data = papa.parse(csv, {header:true})
      res = await fetch('/data/DOB-FA-D.csv')
      csv = await res.text()
      let d_data = papa.parse(csv, {header:true})
      res = await fetch('/data/DOB-FA-E.csv')
      csv = await res.text()
      let e_data = papa.parse(csv, {header:true})

      setSourceData({...sourceData, A: a_data.data, D: d_data.data, E: e_data.data})
      
    } 
    loadData()
  },[])

  const toNum =  (val) => {
    if(typeof val === 'string') {
      return +(val.replace(/,/g, ''))
    }
    if(typeof val === 'number') {
      return val
    }
    return 0
  }

  const fa = useMemo(() => {
    console.log('sourceData', sourceData)
    let d_filter = sourceData?.["D"]?.filter(d => d.DBSFD1 === beds_code)?.[0] || {}
    let e_filter = sourceData?.["E"]?.filter(d => d.DBSFE1 === beds_code)?.[0] || {}
    const foundation_amount = 8040
    const frpl = 0.65
    const raw_values =  {
      tafpu: d_filter?.['M(OP0088) 00 SELECTED TAFPU'],
      dist_name: d_filter?.['DISTNAME'],
      regional_cost_index: d_filter?.['N(MI0125) 03 REGIONAL COST INDEX (RCI)'],
      base_year_enrollment: toNum(e_filter?.['J(PC0257) 00 2023-24 PUBLIC ENROLLMENT EST.']),
      // -- Extraordinay Needs Pupils
      english_language_learning_pupils: e_filter?.['T(PC0273) 00 ELL COUNT FOR EN%'],
      poverty_pupil_count: e_filter?.['X(PC0278) 00 CENSUS COUNT FOR EN%'],
      frpl_rate: e_filter?.['M(PC0260) 04 LUNCH %, K-6, 3-YEAR AVG.'],
      sparcity_factor: e_filter?.['Q(PC0264) 03 SPARSITY FACTOR'],
      has_less_than_k12: e_filter?.['P(MI0010) 00 LESS THAN K-12 INDEX: K-12=1, OTHERS=0'],
      pupil_needs_index:''
    }

    let frpl_count = Math.round(raw_values.base_year_enrollment * toNum(raw_values.frpl_rate) * frpl)
    let sparcity_count = Math.round(toNum(raw_values.sparcity_factor) * raw_values.base_year_enrollment) * raw_values.has_less_than_k12
    let extraordinary_needs_pupil_count = frpl_count + toNum(raw_values.poverty_pupil_count) + toNum(raw_values.english_language_learning_pupils) + sparcity_count + 1
    let extraordinary_needs_percent = Math.floor( (extraordinary_needs_pupil_count / raw_values.base_year_enrollment) * 1000) / 1000
    let pupil_needs_index = Math.round(Math.min(1+extraordinary_needs_percent, 2) * 1000) / 1000

    const calc_values = {
      frpl_count,
      extraordinary_needs_pupil_count,
      sparcity_count,
      extraordinary_needs_percent,
      pupil_needs_index
    } 

    return {
      ...raw_values,
      ...calc_values
    }

  },[sourceData])


  return (
    <div className={`min-h-[300px] border bg-slate-100 p-2 rounded-md w-full flex flex-col` }>
      <div className='text-xl font-bold'>Foundation Aid Calculator</div> 
      <div>
        <div>District: {fa.dist_name}</div>
        
        <div className='p-1'>
          <div>TAFPU: {fa.tafpu}</div>
        </div>
        
        <div className='p-2'> 
          <div className='font-bold'>  Selected Foundation Aid </div>
          <div> forumula: (Adjusted Foundation Aid Amount * Pupil Needs Index * Regional Cost Index) - Local Share Amount</div>
          <div> (A * {fa.pupil_needs_index} * {fa.regional_cost_index}) - D = ? </div>

          <div className='p-2'> 
            <div className='font-bold'>  Adjusted Foundation Aid Amound </div>
            <div> forumula: Something</div>
            <div> {fa.regional_cost_index}</div>
          </div>

          <div className='p-2'> 
            <div className='font-bold'>  Regional Cost Index </div>
            <div> {fa.regional_cost_index}</div>
          </div>

          <div className='p-2'> 
            <div className='font-bold'>  Pupil Needs Index </div>
            <div> forumula: MIN(1+ENPC%, 2)</div>
            <div> {fa.pupil_needs_index}</div>
            <div className='p-2'> 
              <div className='font-bold'>  Extraordinary needs pupil %</div>
              <div> forumula:  Extraordinary needs pupil count / base year Enrollment</div>
              <div> {fa.extraordinary_needs_pupil_count} / {fa.base_year_enrollment} = {fa.extraordinary_needs_percent}</div>
               <div className='p-2'> 
                <div className='font-bold'>  Extraordinary needs pupil count</div>
                <div> forumula: frpl count + poverty_pupil_count + english_language_learning_pupils + sparcity_count + 1</div>
                <div> {fa.frpl_count} + {toNum(fa.poverty_pupil_count)} + {toNum(fa.english_language_learning_pupils)} + {fa.sparcity_count} + 1 = {fa.extraordinary_needs_pupil_count} </div>
              </div>
            </div>



           
          </div>
        </div>



        



        
        <div>Regional Cost Index: {fa.regional_cost_index}</div>
        <div>Base Year Enrollment: {fa.base_year_enrollment}</div>
        

        <div>ELL pupils: {fa.english_language_learning_pupils}</div>
        <div>Poverty Count: {fa.poverty_pupil_count}</div>
        <div>FRPL Rate: {fa.frpl_rate}</div>
        <div>FRPL Count : {fa.frpl_count}</div>
        <div>ENPC : {fa.extraordinary_needs_pupil_count}</div>
        <div>sparcity factor : {fa.sparcity_factor}</div>
        <div>sparcity_count : {fa.sparcity_count}</div>
        
        
      </div>
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