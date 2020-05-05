let dataset, svg, cameras;

const margin = {
    left: 170,
    top: 50,
    bottom: 50,
    right: 20
};

const width = 1000 - margin.left - margin.right;
const height = 950 - margin.top - margin.bottom;


d3.json('data/camera_details_cleaned_trimmed.json').then(data => {
    dataset = data;
    console.log(dataset[0]);
    setTimeout(drawInitial(), 100);
})


function drawInitial() {
    svg = d3.select('#viz')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 950)
        .attr('opacity', 1)

    draw1();
}



// Calling the Scroller

let scroll = scroller().container(d3.select('#graphic'));

scroll();

let lastIndex, activeIndex = 0;

scroll.on('active', function (index) {
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', (d, i) => {
            return i === index ? 1 : 0.1
        })
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    console.log(lastIndex, activeIndex);

    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;
})

let activationFunctions = [
    draw1,
    draw2,
    draw3,
    draw4,
    draw5,
    draw6
]

// The Cover
function draw1() {
    console.log("The Cover")
    let col = 20;
    let row = 18;
    let w = 1000 / col;

    let temp = Array.from(dataset);
    // d3.shuffle(temp);
    temp = temp.slice(0, col * row);


    if (lastIndex === 0) {
        cameras = svg.selectAll('.camera')
            .data(dataset).enter()
            .append('g')
            .attr('class', 'camera');
        cameras.append('image')
            .attr('xlink:href', (d) => d.Image)
            .attr('width', w)
            .attr('height', w)
            .attr('y', (d, i) => Math.floor(i / col) * w + margin.top)
            .attr('x', (d, i) => i % col * w)
            .attr('class', 'camera-image');
    } else {
        svg.selectAll('.camera-image')
            .transition()
            .duration(500)
            .style('opacity', 1);
    }

}

// The Market Share Compare to Film
function draw2() {
    console.log("The Market Share Compare to Film")
    if (lastIndex === 0) {
        svg.selectAll('.camera-image')
            .transition()
            .duration(500)
            .style('opacity', 0);
    }
    svg.transition().style('background-color', 'black')

}

// The Clarity of Image & Sensor Improvements
function draw3() {
    console.log("The Improvements of Sensor & Clarity of Image")
    svg.transition().style('background-color', 'red')

}

// A Visual Catelog of All Released Camaras
function draw4() {
    console.log("A Visual Catelog of All Released Camaras")
    svg.transition().style('background-color', 'green')

}

// A 3D View of Body/Sensor Ratio
function draw5() {
    console.log("A 3D View of Body/Sensor Ratio")
    svg.transition().style('background-color', 'blue')

}

// Mobile Phone Comes In
function draw6() {
    console.log("Mobile Phone Comes In")
    svg.transition().style('background-color', 'white')

}