let w = 960;
let h = 640;
let xPadding = 70;
let yPadding = 50;

let viz = d3.select("#container")
  .append("svg")
  .attr("width", w)
  .attr("height", h);


function gotData(incomingData) {
  console.log(incomingData);

  let mergedData = d3.merge(incomingData);

  // xScale & Axis
  let maxX = d3.max(mergedData, d => d.x);
  let xScale = d3.scaleLinear().domain([0, maxX]).range([xPadding, w - xPadding]);
  let xAxisGroup = viz.append('g').attr('class', 'xaxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);
  xAxisGroup.attr('transform', 'translate(' + 0 + ',' + (h - yPadding) + ')')

  // yScale & Axis
  let maxY = d3.max(mergedData, (d, i) => {
    return d.y;
  });
  let yScale = d3.scaleLinear().domain([0, maxY]).range([h - yPadding, yPadding]);
  let yAxisGroup = viz.append('g').attr('class', 'xaxis');
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr('transform', 'translate(' + (xPadding) + ',' + 0 + ')')


  // group for viz
  let vizGroup = viz.append('g').attr('class', 'vizGroup');

  // visualize data at launch
  visualizeData(0);

  function visualizeData(dataIndex) {
    let dataToShow = incomingData[dataIndex];
    console.log(dataToShow)
    let dataGroups = vizGroup.selectAll('.datagroups').data(dataToShow, (d) => d.name)

    // ENTER ELEMENTS
    let enteringElements = dataGroups.enter()
    enteringElements = enteringElements.append('g')
      .attr('class', 'datagroups')

    enteringElements.append('circle')
      .attr('r', 30)
      .attr('fill', 'red');
    enteringElements.append('text')
      .text((d) => d.name)
      .attr('y', 17)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '3em')
      .attr('fill', 'white');

    enteringElements.attr('transform', getTopLocation)
      .transition().duration(500)
      .attr('transform', getGroupLocation)

    // EXIT ELEMENTS
    let exitingElements = dataGroups.exit();
    exitingElements.transition().duration(500).delay(500)
      .attr('transform', getTopLocation).remove()

    // UPDATING ELEMENTS
    dataGroups.transition().duration(750).delay((d, i) => i * 400).attr('transform', getGroupLocation)
    dataGroups.select('text').text((d) => d.name)

    function getTopLocation(d, i) {
      let x = xScale(d.x);
      let y = -50;
      return 'translate(' + x + ',' + y + ')'
    }

    function getGroupLocation(d, i) {
      let x = xScale(d.x);
      let y = yScale(d.y);
      return 'translate(' + x + ',' + y + ')'
    }

  }

  // click event handler
  for (let i = 0; i < 5; i++) {
    $(`#step${i+1}`).click(() => visualizeData(i))
  }

}


d3.json("data.json").then(gotData);