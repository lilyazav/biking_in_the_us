import React, { useEffect } from 'react';
import * as d3 from "d3";
import { numberWithCommas } from '../helper';

function Map({countyMapData, loc, stateBounds}) {
    const sectionName = "county_map"

    const margin = {top: 0, right: 10, bottom: 10, left: 10};
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    useEffect(() => { 
        if(countyMapData && loc) {
            let data = countyMapData.features
            if(loc !== "United States") { 
                // Need to trim state data of extra space
                data = data.filter(el => el.properties.state === " ".concat(loc))
            }

            d3.select("#".concat(sectionName)).select("svg").remove()
            d3.select("#legend").select("svg").remove()

            // Map and projection
            let projection = d3.geoAlbersUsa()
            projection.fitSize([width, height], countyMapData);

            let geoGenerator = d3.geoPath()
            .projection(projection)

            let colorScale = d3.scaleThreshold()
            .domain([0, 25, 50, 75])
            .range(d3.schemeReds[5]);   

            const legendSvg = d3.select("#legend")
            .append("svg")
            .attr("width", width)
            .attr("height", 100)

            const keys = ["Up to 25%", "25-50%", "50-75%", "Over 75%"]

            // Add one dot in the legend for each name.
            legendSvg.selectAll("sections")
            .data([0, 25, 50, 75])
            .enter()
            .append("rect")
                .attr("height", 20)
                .attr("width", 100)
                .attr("x", function(d,i){ return 100 * i  + 100}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("y", 40)
                .style("fill", function(d){ return colorScale(d)})
                .style("stroke", "black")
                .style("stroke-width", "2px")

            // Add one dot in the legend for each name.
            legendSvg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
                .attr("x", function(d,i){ return 100 * i  + 100})
                .attr("y", 20) 
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("font-size", "15px")
                .style("alignment-baseline", "middle")

            const tip = d3.select("#".concat(sectionName))
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")


            var svg = d3.select("#".concat(sectionName))
            .append("svg")
            .attr("width", width)
            .attr("height", height)


            svg.append("g")
                .selectAll("path")
                .data(data)
                .join('path')
                .attr('d', geoGenerator)
                .attr('fill', function (d) {
                    let prop = d.properties;
                    let total = prop.ttl;
                    let car = prop.car / total * 100
                    return colorScale(car)
                    
                })
                .attr('stroke', '#FFF')
                .attr('stroke-width', 0.05)

            if(loc != "United States") {
                let [[x0, y0], [x1, y1]] = stateBounds.find(el=> el.state === loc).bounds
                // 10 and 20 are approximations. 
                let scaleFactor = Math.min((width/ (x1 - x0) / 10) , height/ (y1 - y0) / 20)

                // svg.attr("transform", `translate(${width / 2} ${height / 2} )`)
                svg.attr("transform", `scale(${scaleFactor})`)
                // .attr("transform", `translate(-${(x0 + x1) / 2} -${(y0 + y1) / 2})`)
            }

            svg.selectAll("path")
            .on("mouseover", function(event, d){  
                let prop = d.properties;
                let total = prop.ttl;
                let car = prop.car / total * 100
                return tip.style("visibility", "visible")
                            .html("<p> Name: " + prop.county + ", " + prop.state + "</p>" +
                                "<p> Percentage: " + car.toFixed(2) + "%</p>" +
                                "<p> Total Drivers: " + numberWithCommas(prop.car) + "</p>")
                            .style("top", (event.pageY - 70)+"px")
                            .style("left",(event.pageX + 20)+"px");})
            .on("mousemove", function(d, event){
                return tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");})
            .on("mouseout", function(){
                return tip.style("visibility", "hidden");})
            }}, [countyMapData, loc])

    return ( 
        <div className="float-child-70">
            <h2>{ loc === "United State" ? "Percentage of Car Commuters in the US" : "Car Commuting by County" }</h2>
            <div id="legend"/>
            <div id="county_map" />
        </div>
    )
}


export default function CountyMap({countyMapData, loc, stateBounds}){

  return(
        <Map countyMapData={countyMapData} loc={loc} stateBounds={stateBounds}></Map>
    
  )
}
  