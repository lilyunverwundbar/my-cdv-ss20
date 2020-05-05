let dataset, viz, cameras;
let axisLayer, graphLayer, tooltipLayer;
let xAxisGroup, yAxisGroup, additionalInfo;

const simulationDuration = 20000;

const w = window.innerWidth;
const h = window.innerHeight;
const xPadding = 200;
const yPadding = 250;

const durationUnit = 500;


const brands = ["Canon", "Fujifilm", "Leica", "Nikon", "Olympus", "Panasonic", "Pentax", "Ricoh", "Samsung", "Sony", "Zeiss", "Acer", "AgfaPhoto", "BenQ", "Casio", "Concord", "Contax", "Epson", "GE", "HP", "Jenoptik", "JVC", "Kodak", "Konica", "Konica-Minolta", "Kyocera", "Minolta", "Minox", "Nokia", "Praktica", "Rollei", "Sanyo", "Sigma", "Toshiba", "Vivitar", "Yakumo"];
const brandColor = {
    "Canon": '#FF0000',
    "Fujifilm": '#009845',
    "Leica": '#F01908',
    "Nikon": '#F8D827',
    "Olympus": '#FEAC12',
    "Panasonic": '#0035BA',
    "Pentax": '#B72756',
    "Ricoh": '#DC3836',
    "Samsung": '#004E99',
    "Sony": '#000000',
    "Zeiss": '#002888',
    "Acer": '#88B535',
    "AgfaPhoto": '#BEBEBE',
    "BenQ": '#311D5C',
    "Casio": '#0077A6',
    "Concord": '#2B5BD9',
    "Contax": '#329AAD',
    "Epson": '#00519D',
    "GE": '#2D70B1',
    "HP": '#006492',
    "Jenoptik": '#F89600',
    "JVC": '#F80000',
    "Kodak": '#FFB318',
    "Konica": '#2F4196',
    "Konica-Minolta": '#7EB3CF',
    "Kyocera": '#F34F52',
    "Minolta": '#7EB3CF',
    "Minox": '#F6CECE',
    "Nokia": '#0091D1',
    "Praktica": '#A2A3A5',
    "Rollei": '#C45E1E',
    "Sanyo": '#C12032',
    "Sigma": '#000000',
    "Toshiba": '#E31202',
    "Vivitar": '#EA71A4',
    "Yakumo": '#B3D2D4'
}

let extents = {};
let xScale, yScale, rScale;
let simulation;

let opt1, opt2, opt3, opt4;


let scroll = scroller().container(d3.select('#graphic'));
scroll();

let lastIndex, activeIndex = 0;

scroll.on('active', function (index) {
    d3.selectAll('.step')
        .transition().duration(durationUnit)
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
    draw0,
    draw1,
    draw2,
    draw3,
    draw4,
    draw5,
    draw6,
    draw7,
    draw8,
]


d3.json('data/camera_details_cleaned_trimmed.json').then(incomingData => {
    incomingData = incomingData.map(d => {
        d.year = Number(d.year);
        return d;
    })
    dataset = incomingData;
    initStructure();
    initVisual();
    console.log(dataset[100]);
})



function initStructure() {
    viz = d3.select('#viz')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('opacity', 1)

    axisLayer = viz.append('g').attr('class', 'axis-layer')
    graphLayer = viz.append('g').attr('class', 'graph-layer');
    tooltipLayer = viz.append('g').attr('class', 'tooltip-layer');

    //init axis group
    xAxisGroup = axisLayer.append('g').attr('class', 'x-axis-group')
        .attr('transform', `translate(0 , ${2})`)

    yAxisGroup = axisLayer.append('g').attr('class', 'y-axis-group')
        .attr('transform', 'translate(' + (w + xPadding / 2) + ', 0)')
        .attr('opacity', 0)
    additionalInfo = axisLayer.append('g').attr('class', 'additional-info')


    // init extent
    extents.year = d3.extent(dataset, d => d.year);
    extents.megapixels = d3.extent(dataset, d => d.megapixels);
    extents.sensor_size = d3.extent(dataset, getSensorSize);
    extents.weight = d3.extent(dataset, d => d.weight);
    extents.body_size = d3.extent(dataset, getBodySize);


    //init scale
    xScale = d3.scaleLinear().range([xPadding, w - xPadding]);
    yScale = d3.scaleLinear().range([h - yPadding, yPadding / 2]);
    rScale = d3.scaleLinear().range([2, 16]);


}


function initVisual() {
    // modify scales
    xScale.domain(extents.year);
    yScale.domain(extents.megapixels);
    rScale.domain(extents.megapixels);

    dataset = dataset.map(d => {
        d.x = xScale(d.year);
        d.y = h / 2;
        return d
    })

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d => String(d)); // remove the comma in year numbers

    xAxisGroup.call(xAxis);

    yAxisGroup.append('text')
        .attr('class', 'y-axis-title')
        .attr('y', yPadding / 2 - 20)
        .attr('fill', 'black')

    graphLayer.selectAll('.datapoint').data(dataset).enter()
        .append('circle')
        .attr('class', 'datapoint')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(d.megapixels))
        .attr('fill', d => brandColor[d.brand])
        .attr('opacity', 0.7)


    graphLayer.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i) {
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`
            <img src='${d.image}' width='100px' style="display:'inline-block'"></img>
                <br><strong>${d.brand} ${d.model}</strong> (${d.year})
                <span id='spec-text'>
                <br><strong>${d.megapixels}</strong> Megapixels
                <br><strong>${d.fl?"Built-In":"Interchangeable"}</strong> Lens <strong>${d.fl?'('+d.fl+')':""}</strong>
                <br> <strong>${d.sensor_type}</strong> Sensor (${d.sensor_size[0]+'×'+d.sensor_size[1]} mm<sup>2</sup>)
                <br><strong>Crop Factor</strong> × ${d.crop}
                <br><strong>${d.dimensions[0]+'×'+d.dimensions[1]+'×'+d.dimensions[2]}</strong> mm<sup>3</sup>
                <br><strong>${d.weight}</strong> grams
                </span>`)
    }

    function mouseOut(d, i) {
        d3.select('#tooltip')
            .style('display', 'none')
        d3.select(this)
            .transition('mouseout')
            .attr('opacity', 0.7)
            .duration(100)
    }


    simulation = d3.forceSimulation(dataset)
        .force('forceX', d => d3.forceX(xScale(d.year)))
        .force('forceY', d => d3.forceY(h / 2))
        .force('collide', d3.forceCollide().radius(d => rScale(d.megapixels) - 0.5))
        .alphaDecay([0.02])
    simulation.on('tick', () => {
        viz.selectAll(".datapoint")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })

    activationFunctions[activeIndex]();
}

// Calling the Scroller

// The Cover
function draw0() {
    console.log("The Cover")
    clean();
    var format = d3.format(",d");
    d3.select("#cam-number")
        .transition()
        .duration(900)
        .on("start", function repeat() {
            d3.active(this)
                .tween("text", function () {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), dataset.length);
                    return function (t) {
                        that.text(format(i(t)));
                    };
                })
                .transition()
                .delay(1500)
                .on("start", repeat);
        });
    d3.select("#company-number")
        .transition()
        .duration(900)
        .on("start", function repeat() {
            d3.active(this)
                .tween("text", function () {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), brands.length);
                    return function (t) {
                        that.text(format(i(t)));
                    };
                })
                .transition()
                .delay(1500)
                .on("start", repeat);
        });
    d3.select("#start-year")
        .transition()
        .duration(900)
        .on("start", function repeat() {
            d3.active(this)
                .tween("text", function () {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), extents.year[0]);
                    return function (t) {
                        that.text(Math.round(((i(t)))));
                    };
                })
                .transition()
                .delay(1500)
                .on("start", repeat);
        });
    d3.select("#end-year")
        .transition()
        .duration(900)
        .on("start", function repeat() {
            d3.active(this)
                .tween("text", function () {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), extents.year[1]);
                    return function (t) {
                        that.text(Math.round(((i(t)))));
                    };
                })
                .transition()
                .delay(1500)
                .on("start", repeat);
        });
    dataset = dataset.map(d => {
        d.x = xScale(d.year);
        d.y = h / 2;
        return d
    })

    yAxisGroup
        .transition()
        .attr('transform', 'translate(' + (w + xPadding / 2) + ', 0)')
        .attr('opacity', 0)

    viz.selectAll('.datapoint')
        .transition()
        .duration(durationUnit)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr('r', d => rScale(d.megapixels))
        .attr('fill', d => brandColor[d.brand])


    simulation
        .force('forceY', d => d3.forceY(h / 2))

    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0)

}

// The Market Share Compare to Film
function draw1() {
    clean()

    console.log("Camera Sensor")
    yScale.domain(extents.megapixels)
    rScale.domain(extents.megapixels);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition()
        .call(yAxis)
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');

    yAxisGroup.select('.y-axis-title').text('resolution (megapixels)');
    if (lastIndex != 2) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(d.megapixels);
            return d
        });
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(d.megapixels))
        .attr('fill', d => brandColor[d.brand])
        .duration(durationUnit);

    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(d.megapixels) - 0.5))

    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);
}

function draw2() {
    clean()
    yScale.domain(extents.megapixels)
    rScale.domain(extents.megapixels);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition()
        .call(yAxis)
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('resolution (megapixels)');

    if (lastIndex != 1) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(d.megapixels);
            return d
        });
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(d.megapixels))
        .attr('fill', d => {
            if (d.sensor_type === 'CCD') {
                return "skyblue"
            } else if (d.sensor_type === 'CMOS') {
                return "green"
            } else if (d.sensor_type === 'Foveon') {
                return 'purple'
            } else {
                return 'white'
            }
        })
        .duration(durationUnit);
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(d.megapixels) - 0.5))

    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);

}

// The Clarity of Image & Sensor Improvements
function draw3() {
    clean()
    yScale.domain(extents.sensor_size);
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition().call(yAxis)
        .transition()
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('sensor size (mm×mm)');

    if (lastIndex != 4) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(getSensorSize(d));
            return d
        })
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(d.megapixels))
        .attr('fill', d => brandColor[d.brand])
        .duration(durationUnit)
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(d.megapixels) - 0.5))


    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);

    setTimeout(() => {
        sensor_size_marker(864, '35mm / Full-Frame');
        sensor_size_marker(329, 'APS-C');
        sensor_size_marker(225, 'Four Thirds');
        sensor_size_marker(116, '1 inch');
        sensor_size_marker(25, '1/2.5 inch');
    }, durationUnit)

    function sensor_size_marker(size, name) {
        additionalInfo.append('line')
            .attr('x1', xPadding)
            .attr('x2', xPadding)
            .attr('y1', yScale(size))
            .attr('y2', yScale(size))
            .transition()
            .attr('x2', w - xPadding)
            .duration(durationUnit * 4)
        additionalInfo.append('text')
            .attr('x', xPadding)
            .attr('y', yScale(size) - 10)
            .attr('opacity', 0)
            .text(name)
            .transition()
            .attr('opacity', 1)
            .duration(durationUnit * 4)
    }
}

// A Visual Catelog of All Released Camaras


// A 3D View of Body/Sensor Ratio
function draw4() {
    clean()
    yScale.domain(extents.sensor_size);
    rScale.domain(extents.megapixels);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition().call(yAxis)
        .transition()
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('sensor size (mm×mm)');


    if (lastIndex != 3) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(getSensorSize(d));
            return d
        })
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(d.megapixels))
        .attr('fill', d => d.fl ? '#ED6168' : '#1C415A')
        .duration(durationUnit)
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(d.megapixels) - 0.5))


    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);

    setTimeout(() => {
        sensor_size_marker(864, '35mm / Full-Frame');
        sensor_size_marker(329, 'APS-C');
        sensor_size_marker(225, 'Four Thirds');
        sensor_size_marker(116, '1 inch');
        sensor_size_marker(25, '1/2.5 inch');
    }, durationUnit)

    function sensor_size_marker(size, name) {
        additionalInfo.append('line')
            .attr('x1', xPadding)
            .attr('x2', xPadding)
            .attr('y1', yScale(size))
            .attr('y2', yScale(size))
            .transition()
            .attr('x2', w - xPadding)
            .duration(durationUnit * 4)
        additionalInfo.append('text')
            .attr('x', xPadding)
            .attr('y', yScale(size) - 10)
            .attr('opacity', 0)
            .text(name)
            .transition()
            .attr('opacity', 1)
            .duration(durationUnit * 4)
    }
}

function draw5() {
    clean()
    yScale.domain(extents.weight);
    rScale.domain(extents.weight);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition().call(yAxis)
        .transition()
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('weight (gram)');


    if (lastIndex) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(d.weight);
            return d
        })
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(d.weight))
        .attr('fill', d => d.fl ? '#ED6168' : '#1C415A')
        .duration(durationUnit)
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(d.weight) - 0.5))


    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);



}

function draw6() {
    clean()
    yScale.domain(extents.body_size);
    rScale.domain(extents.body_size);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition().call(yAxis)
        .transition()
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('body size (litre)');


    if (lastIndex) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(getBodySize(d));
            return d
        })
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(getBodySize(d)))
        .attr('fill', d => d.fl ? '#ED6168' : '#1C415A')
        .duration(durationUnit)
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(getBodySize(d)) - 0.5))


    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);

}

function draw7() {
    clean()
    yScale.domain(extents.body_size);
    rScale.domain(extents.body_size);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition().call(yAxis)
        .transition()
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('body size (litre)');


    if (lastIndex) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(getBodySize(d));
            return d
        })
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(getBodySize(d)))
        .attr('fill', d => d.fl ? '#ED6168' : '#1C415A')
        .duration(durationUnit)
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(getBodySize(d)) - 0.5))


    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);
}

function draw8() {
    clean()
    yScale.domain(extents.body_size);
    rScale.domain(extents.body_size);

    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition().call(yAxis)
        .transition()
        .attr('opacity', 1)
        .attr('transform', 'translate(' + (w - xPadding / 2) + ', 0)');
    yAxisGroup.select('.y-axis-title').text('body size (litre)');


    if (lastIndex) {
        dataset = dataset.map(d => {
            d.x = xScale(d.year);
            d.y = yScale(getBodySize(d));
            return d
        })
    }
    graphLayer.selectAll('.datapoint')
        .transition()
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(getBodySize(d)))
        .attr('fill', d => d.fl ? '#ED6168' : '#1C415A')
        .duration(durationUnit)
    simulation
        .force('forceY', d => d3.forceY(d.y))
        .force('collide', d3.forceCollide().radius(d => rScale(getBodySize(d)) - 0.5))


    setTimeout(() => {
        simulation.restart();
    }, durationUnit * 2.0);
}

function clean(lastState) {
    simulation.stop();
    axisLayer.select('.additional-info')
        .transition()
        .attr('opacity', 0)
        .duration(durationUnit * 0.5)

    axisLayer.select('.additional-info')
        .transition()
        .delay(durationUnit)
        .attr('opacity', 1)

    setTimeout(() => {
        axisLayer.select('.additional-info').html('').attr('opacity', 1)
    }, durationUnit * 0.5)

    d3.select("#cam-number").text('0')
    d3.select("#start-year").text('0')
    d3.select("#end-year").text('9999')
    d3.select("#company-number").text('0')



    // .delay(durationUnit * 0.5)
    // .attr('opacity', 1);


    // .duration(durationUnit * 0.5)
    // .delay(durationUnit * 0.5)
    // .attr('opacity', 1);

}


function getSensorSize(d, i) {
    return d.sensor_size[0] * d.sensor_size[1];
}

function getBodySize(d, i) {
    if (d.dimensions && d.dimensions.length === 3)
        return d.dimensions[0] * d.dimensions[1] * d.dimensions[2] / 1000000;
    else {
        return 0
    }
}