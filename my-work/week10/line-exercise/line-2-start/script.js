d3.json("births.json").then(gotData);


let w = 900;
let h = 500;
let xpadding = 100;
let ypadding = 50;
let viz = d3.select("#container")
  .append("svg")
  .style("width", w)
  .style("height", h)
  .style("outline", "solid black");


function gotData(incomingData) {
  // the following function is defined below
  // it allows for us to NOT WORRY about parsing
  // time strings and creating JS date objects
  // in the following script
  incomingData = fixJSDateObjects(incomingData);
  console.log(incomingData);


  // temporarily flatten data to get the minima/maxima:
  let flatData = d3.merge(incomingData)
  // we can use a  time scale because our data expresses
  // years in the form of JS date objects
  let xDomain = d3.extent(flatData, function (d) {
    return d.year
  });
  let xScale = d3.scaleTime().domain(xDomain).range([xpadding, w - xpadding]);
  let xAxis = d3.axisBottom(xScale);
  let xAxisGroup = viz.append("g")
    .attr("class", "xaxisgroup")
    .attr("transform", "translate(0," + (h - ypadding) + ")");
  xAxisGroup.call(xAxis);

  let yMax = d3.max(flatData, function (d) {
    return d.birthsPerThousand;
  })
  let yDomain = [0, yMax];
  let yScale = d3.scaleLinear().domain(yDomain).range([h - ypadding, ypadding]);
  let yAxis = d3.axisLeft(yScale);
  let yAxisGroup = viz.append("g")
    .attr("class", "yaxisgroup")
    .attr("transform", "translate(" + (xpadding / 2) + ",0)");
  yAxisGroup.call(yAxis);


  let graphGroup = viz.append("g").attr("class", "graphGroup");

  let lineMaker = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.birthsPerThousand))

  let lineRandomizer = d3.line()
    .x(d => d3.randomUniform(xpadding, w - xpadding)())
    .y(d => d3.randomUniform(h - ypadding, ypadding)())


  graphGroup.selectAll('.line').data([incomingData[0]]).enter()
    .append('path')
    .attr('d', lineMaker)
    .attr('fill', 'none')
    .attr('stroke-width', 5)
    .attr('stroke', d => (d[0].country == 'United States') ? 'blue' : 'red')
    .classed('line', true)


  d3.select('#china').on('click', function () {
    graphGroup.selectAll('.line').data([incomingData[1]]).enter()
    graphGroup.selectAll('path')
      .transition()
      .attr('d', lineRandomizer)
      .attr('stroke', 'black')
      .transition()
      .attr('d', lineMaker)
      .attr('stroke', d => (d[0].country == 'United States') ? 'blue' : 'red')
  })
  d3.select('#usa').on('click', function () {
    graphGroup.selectAll('.line').data([incomingData[0]]).enter()
    graphGroup.selectAll('path')
      .transition()
      .attr('d', lineRandomizer)
      .attr('stroke', 'black')
      .transition()
      .attr('d', lineMaker)
      .attr('stroke', d => (d[0].country == 'United States') ? 'blue' : 'red')
  })
}

// function that turns all datapoints year values
// into JS date objects in the very beginning
// so that WE DON'T HAVE TO DEAL WITH IT LATER
function fixJSDateObjects(dataToFix) {
  // timeParser
  let timeParse = d3.timeParse("%Y");
  return dataToFix.map(function (data) {
    return data.map(function (d) {
      return {
        "country": d.country,
        "year": timeParse(d.year),
        "birthsPerThousand": d.birthsPerThousand
      }
    })
  });
}