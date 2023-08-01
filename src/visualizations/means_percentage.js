import React, { useEffect } from 'react';
import * as d3 from "d3";
import { numberWithCommas } from '../helper';


function MeansBarChart({meansData, loc}) {
  const sectionName = "means_per"

  const margin = {top: 30, right: 30, bottom: 120, left: 60};
  const width = 460 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  useEffect(() => {
      const selectedData = meansData.filter(el => el.Location === loc)
      const total = selectedData[0].People
      selectedData.shift()

      d3.select("#".concat(sectionName)).select("svg").remove()
      d3.select("#".concat(sectionName)).select("div").remove()
    
      selectedData.sort(function(b, a){
        return a.People - b.People;
      })

      const svg = d3.select("#".concat(sectionName))
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)       
        .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)

      const tip = d3.select("#".concat(sectionName)).append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")

      const x = d3.scaleBand()
        .range([0, width])
        .domain(selectedData.map(d => d.Means))
        .padding(0.2)
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      const max = d3.max(selectedData, d => 100 * d.People/total)
      // const yMax = (max + 10 > 100) ? 100 : max + 10;
      const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])
      svg.append("g")
        .call(d3.axisLeft(y))  

      // X Axis
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", (width + margin.left + margin.right + 60)/2)
          .attr("y", height + margin.bottom - 20)
          .text("Means of Getting to Work");
        
      // Y Axis
      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top)
        .attr("y", -margin.left+20)
        .text("Percentage of Commuters")
        .attr("transform", "rotate(-90)")      
        
      svg.selectAll("mybar")
          .data(selectedData)
          .join("rect")
            .attr("x", d => x(d.Means))
            .attr("y", height)
            .attr("id", d => d.Means)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", "green");

      svg.selectAll("rect")
        .on("mouseover", function(event, d){  
            return tip.style("visibility", "visible")
                      .html("<p> Commute: " + d.Means + "</p>" +
                            "<p> Percentage: " + (d.People/total * 100).toFixed(2) + "%</p>" +
                            "<p> Total People: " + numberWithCommas(d.People) + "</p>")
                      .style("top", (event.pageY - 70)+"px")
                      .style("left",(event.pageX + 20)+"px");})
        .on("mousemove", function(d, event){
            return tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");})
        .on("mouseout", function(){
            return tip.style("visibility", "hidden");});

      svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y",  d => y(d.People/total * 100))
        .attr("height", d => height - y(d.People/total * 100))
        .delay()
  
      svg.selectAll("svg")
      .data(selectedData)
      .exit()
      .remove()
    }, [meansData, loc])
 
    return (
      <div className="float-child-30">
        <h2 style={{margin: "10px"}}>How People Get To Work, 2021</h2>
        <div id={sectionName} width={width + margin.left + margin.right} height={height + margin.top 
        + margin.bottom}></div>
      </div>
)}


export default function MeansPercentage({states, meansData, loc}){

  return(
    <MeansBarChart states={states} meansData={meansData} loc={loc}></MeansBarChart>
  )
}
  