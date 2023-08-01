import React,  { useEffect, useState }  from 'react';
import './App.css';
import * as d3 from "d3";
import Navbar from 'react-bootstrap/Navbar';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';

import MeansPercentage from './visualizations/means_percentage';
import CountyMap from './visualizations/county_map';
import TopNonCar from './visualizations/top_non_car'

import { introText, secondText, thirdText, fourthText, sources } from './text';

import state_csv from "./data/state_names.csv";
import means_csv from "./data/means.csv";
import counties from "./data/counties/us_acs_2021.geojson";
import state_bounds_js from "./data/state_bounds.json";


function App() {
  const stateBounds = state_bounds_js;
  const [states, setStates ] = useState(null)
  const [meansData, setMeansData] = useState(null)
  const [countyMapData, setCountyMapData] = useState(null)
  const [loc, setLoc ] = useState("United States")

    function handleLocChange(e){
      const loc = e.target.value
      setLoc(loc)
    }

    function fetchAllData(){
      const states = d3.csv(state_csv)
      const means = d3.csv(means_csv)
      const county_gjson = d3.json(counties)

      Promise.all([states, means, county_gjson]).then(res => {
        let states = res[0].map(el => el.x)
        setStates(states)
        setMeansData(res[1])
        setCountyMapData(res[2])
      })
      .catch(err => console.log("err", err))
    }

    useEffect(() => {
      if(!states || !meansData || !countyMapData || !stateBounds ){
        fetchAllData()
      }}, [])

     const statesSec = () => {
            return(<select onChange={handleLocChange} value={loc}>
              <option value={"United States"}>United States</option>
              {states.map((st) => <option value={st}>{st}</option>)}
           </select>)
     }


    return (
      <> {
        states && meansData && countyMapData && stateBounds ?
        <div className="Main">
        <header className="App-header section">
          <Navbar bg="dark">
            <Container>
              <Navbar.Brand><FontAwesomeIcon icon={faBicycle}/></Navbar.Brand>
              <h1>A Look at Biking in the US</h1>
              <h4>Bikes are part of the Climate Change Solution</h4>
              <p>By Lillian Zavatsky</p>
            </Container>
          </Navbar>
        </header>
        <div className="section">
          { introText}
          <div className="graphicHeader">
            <h2>Americans Drive... A Lot</h2>
            <h5 style={{margin: "10px", color: '#656363'}}>Source: American Community Survey, 2021</h5>
            { states ? statesSec() : null }
          </div>
          <div className="float-container">
            <MeansPercentage states={states} meansData={meansData} loc={loc}/>
            <CountyMap countyMapData={countyMapData} stateBounds={stateBounds} loc={loc}/>   
          </div>      
          { secondText }
          <br/>
          { thirdText }
          <br/>
          <div className="graphicHeader">
            <h2>How Else Do We Get Around?</h2>
            <h5 style={{margin: "10px", color: '#656363'}}>Source: American Community Survey, 2021</h5>
            { states ? statesSec() : null}
          </div>
          <div className="float-container">
            <TopNonCar countyMapData={countyMapData} loc={loc} />
          </div>
          <br/>
          { fourthText }
        <br />
        </div>
        <div className="section">
        { sources }
        </div>
      </div>
      : null
      }
      </>
  );
}

export default App;
