// just some console.logging at the start to make
// sure the script runs and we have data (from dataManager.js)
console.log("\n\n\nWelcome!\n\n\n");
console.log("script runs.");
console.log("do we have data?");
// check if variable exists: https://stackoverflow.com/a/519157
console.log("data:", typeof data !== 'undefined' ? data : "nothing here");
console.log(typeof data !== 'undefined' ? "seems like it ;-) it comes from the dataManager.js script." : "...damnit! let's see what is going wrong in the dataManager.js script.");

let w = 800;
let h = 500;
let padding = 50;
let xScale, xAxis, xAxisGroup, yMax, yDomain, yScale;
let graphGroup;

let UNITTIME = 200;


let viz = d3.select('#container')
    .append('svg')
    .style('width', w)
    .style('height', h)

function add() {
    addDatapoints(1);
    refreshAxis();
    refreshGraph();
}

function remove() {
    removeDatapoints(1);
    refreshAxis();
    refreshGraph();
}

function addAndRemove() {
    removeAndAddDatapoints(1, 1);
    refreshAxis();
    refreshGraph();
}

function sort() {
    sortDatapoints();
    refreshAxis();
    refreshGraph();
}

function shuffle() {
    shuffleDatapoints();
    refreshAxis();
    refreshGraph();
}


d3.selectAll("#buttonA").on("click", add);
d3.selectAll("#buttonB").on("click", remove);
d3.selectAll("#buttonC").on("click", addAndRemove);
d3.selectAll("#buttonD").on("click", sort);
d3.selectAll("#buttonE").on("click", shuffle);
d3.selectAll("#buttonF").on("click", function () {
    removeAndAddDatapoints(Math.random() * data.length, Math.random() * data.length * 2);
    refreshAxis();
    refreshGraph();
});



// AXIS
xAxisGroup = viz.append('g').classed('xAxis', true);

function refreshAxis() {
    let allNames = data.map(d => d.key)
    xScale = d3.scaleBand()
        .domain(allNames)
        .range([padding, w - padding])
        .paddingInner(0.1)
    xAxis = d3.axisBottom(xScale)
    xAxis.tickFormat(d => {
        return data.filter(dd => dd.key == d)[0].name
    })
    xAxisGroup.transition().duration(UNITTIME).delay(UNITTIME * 2).call(xAxis);
    xAxisGroup.selectAll('text').attr('font-size', 24).attr('y', 9);
    xAxisGroup.selectAll('line').remove();
    xAxisGroup.attr('transform', `translate(0,${h-padding})`);

    yMax = d3.max(data, d => d.value);
    yDomain = [0, yMax]
    yScale = d3.scaleLinear().domain(yDomain).range([0, h - padding * 2])
}

refreshAxis()


// GRAPH
graphGroup = viz.append('g').classed('graphGroup', true)

function refreshGraph() {
    let elementsForPage = graphGroup.selectAll('.datapoint').data(data, d => d.key);
    let enteringElements = elementsForPage.enter();
    let exitingElements = elementsForPage.exit();

    //existing data
    elementsForPage
        .transition()
        .duration(UNITTIME)
        .delay(UNITTIME * 2)
        .attr('transform', d => `translate(${xScale(d.key)},${h-padding})`);
    elementsForPage
        .select('rect')
        .transition()
        .duration(UNITTIME)
        .delay(UNITTIME * 2)
        .attr('width', xScale.bandwidth)
        .attr('height', (d) => yScale(d.value))
        .attr('y', (d) => -yScale(d.value))
        .attr('fill', 'black')

    // entering data
    let enteringDataGroups = enteringElements.append('g').classed('datapoint', true);
    enteringDataGroups.attr('transform', (d, i) => `translate(${xScale(d.key)},${h-padding})`);
    enteringDataGroups
        .append('rect')
        .attr('width', xScale.bandwidth)
        .attr('height', 0)
        .attr('y', 0)
        .attr('fill', 'white')
        .transition()
        .duration(UNITTIME)
        .delay(UNITTIME * 2)
        .attr('width', xScale.bandwidth)
        .attr('height', d => yScale(d.value))
        .attr('y', d => -yScale(d.value))
        .attr('fill', 'red')

    // exiting data
    exitingElements
        .select('rect')
        .transition()
        .duration(UNITTIME)
        .attr('fill', 'blue')
    exitingElements
        .select('rect')
        .transition()
        .duration(UNITTIME)
        .delay(UNITTIME)
        .attr('width', xScale.bandwidth)
        .attr('height', 0)
        .attr('y', 0)
        .remove()
}

refreshGraph();