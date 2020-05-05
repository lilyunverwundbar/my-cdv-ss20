let w = 1400;
let h = 500;
let padding = 25;



let viz = d3.select("#visualization")
  .append("svg")
  .style("background-color", "lavender")
  .attr("width", w)
  .attr("height", h);



// initialise scales
let xScale = d3.scaleTime().range([padding, w - padding]);



d3.json("data.json").then(function (incomingData) {
  console.log(incomingData);

  // incomingData = incomingData.slice(0, 100);

  //turn date in to data object
  incomingData = incomingData.map(d => {
    d.date = new Date(d.parsedDate)
    d.price = Number(d.price);
    return d
  })


  let priceExtent = d3.extent(incomingData, d => d.price);
  let rScale = d3.scaleLinear().domain(priceExtent).range([2, 20]);

  console.log(incomingData)
  // get the earliest and latest date in the dataset
  let extent = d3.extent(incomingData, function (d) {
    return d.date;
  })
  console.log(extent);
  // amend domain to scale
  xScale.domain(extent);
  // group to hold axis
  let xAxisGroup = viz.append("g").attr("class", "xaxisgroup");
  // ask d3 to get an axis ready
  let xAxis = d3.axisBottom(xScale);
  // build the axis into our group
  xAxisGroup.call(xAxis);




  // put a circle for each data point onto the page

  incomingData = incomingData.map(d => {
    d.x = xScale(d.date);
    d.y = h / 2;
    return d;
  })

  viz.selectAll(".datapoint").data(incomingData).enter()
    .append("circle")
    .attr("class", "datapoint")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", d => rScale(d.price));

  // problem: points overlap!


  let simulation = d3.forceSimulation(incomingData)
    .force('forceX', d => d3.forceX(xScale(d.date)))
    .force('forceY', d3.forceY(h / 2))
    .force('collide', d3.forceCollide().radius(d => rScale(d.price) + 1))
    .on('tick', simulationRan);

  function simulationRan() {
    viz.selectAll(".datapoint")
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      })
  }


  // console.log(incomingData[0])


})