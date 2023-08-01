import React, { useEffect, useState } from 'react';
import * as d3 from "d3";
import { numberWithCommas } from '../helper';

const varFullName = {
    wlk: "Walk",
    pt: "Public Transportation",
    mtc: "Motorcycle",
    wfh: "Work From Home",
    otr: "Other",
    taxi: "Taxi"
}

function displayCounties(counties){
    let rows = [];
    for(let i = 0; i < counties.length; i++){
        let props = counties[i].properties
        let name = props.county
        let means = varFullName[props.tpnoncar]
        let amount = numberWithCommas(props.numnocr)
        let percent = props.pernocr.toFixed(2)
        rows.push(
            <div className="float-child-30 rank">
                <h4>{i + 1}. {name}     :   {means}</h4>
                <div>{amount} total people who {means}.</div>
                <div>{percent}% of commuters.</div>
            </div>
    )}
    
    return rows;
}


function TopNonCarChart({countyMapData, loc}) {
    const [topCounties, setTopCounties ] = useState([]);

    const sectionName = "top_non_car"
    const margin = {top: 0, right: 10, bottom: 10, left: 10};
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

  useEffect(() => {
    if(loc === "United States"){
        let sortedData = countyMapData.features.sort((a, b) => b.properties.pernocr - a.properties.pernocr)
        let selected = sortedData.slice(0, 9)
        setTopCounties(selected)
    } else {
        // us_acs_2021.geojson has space in front of state names... should fix
        let filtered = countyMapData.features.filter(el => el.properties.state === " ".concat(loc))
        let sortedData = filtered.sort((a, b) => b.properties.pernocr - a.properties.pernocr)
        let selected = sortedData.slice(0, 9)
    
        setTopCounties(selected)
    }
  }, [loc])

    return (
        <div>
        <h2 style={{margin: "10px"}}>Top Means of Getting to Work Without a Car</h2>
        <div id={sectionName} width={width + margin.left + margin.right} height={height + margin.top 
        + margin.bottom}>
            <div className="float-container">
                {displayCounties(topCounties)}
            </div>
        </div>
        </div>
)}


export default function TopNonCar({countyMapData, loc}){

  return(
    <TopNonCarChart countyMapData={countyMapData} loc={loc}></TopNonCarChart>
  )
}
  