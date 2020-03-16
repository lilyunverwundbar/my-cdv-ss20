const COLOR = {
    "orange": '#E04838',
    "yellow": '#FFCA4A',
    "blue": '#3B8CF3',
    "violet": '#57068C',
    'gray': '#444444',
    'lightgray': '#D2D2D2'
}
COLOR.backgroundColor = "white"

const viz = d3.select('#container')
    .append('svg')
    .attr('id', 'viz')
    .style('width', '100%')
    .style('height', '100%')
    .style('background', COLOR.backgroundColor)

const w = 1200,
    h = 800;


function gotData(data) {
    initDots(data);
}

const RANDOM_COLORS = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
]

function initDots(data) {
    const dot_row = 54;
    const dot_radius = 4;
    const dot_size = 10;

    let locationCountData = getLocationCount(data);
    let locationDots = getLocationDots(locationCountData);
    let cities = getCities(locationCountData);
    let countries = getCountries(locationCountData);

    let dotSection = viz.append('g')
        .attr('id', 'dotSection')
        .attr('transform', 'translate(' + 50 + ',' + 40 + ')')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Gill Sans');


    dotSection.selectAll('.location-dot')
        .data(locationDots).enter()
        .append('circle')
        .attr('r', dot_radius)
        .attr('transform', getLocationDotTranslation)
        .attr('fill', getLocationDotColor)
        .attr('fill-opacity', 1)

    const legendRow = 15,
        legendWidth = 128,
        legendHeight = 13,
        legendOffset = [0, 555];

    let legendGroup = dotSection.append('g')
        .attr('id', 'legend-group')
        .attr('transform', 'translate(' + legendOffset[0] + ',' + legendOffset[1] + ')')

    let legends = legendGroup.selectAll('.dot-legend')
        .data(locationCountData).enter()
        .append('g')
        .attr("transform", getLegendTranslation)

    legends.append('text')
        .text(d => `${d.city}, ${d.country_code}`)
        .attr('font-size', 12)
        .attr('text-anchor', 'start')
        .attr('fill', getLocationDotColor)
        .attr('font-weight', (d, i) => {
            if (i < legendRow) return 'bold'
        })

    let dotTitle = dotSection.append('g')
        .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')
        .attr('font-size', 100)
        .attr('fill', COLOR.backgroundColor)


    dotTitle.append('text')
        .text(`${locationDots.length} Online Visits`)
        .attr('y', -200)
    dotTitle.append('text')
        .text(`${cities.length} Cities`)
        .attr('y', -100)
    dotTitle.append('text')
        .text(`${countries.length} Countries`)

    function getLegendTranslation(d, i) {
        let x = Math.floor(i / legendRow);
        let y = i % legendRow;
        return 'translate(' + x * legendWidth + ',' + y * legendHeight + ')'
    }

    function getLocationDotColor(d, i) {
        let dotColor = d3.scaleOrdinal(d3.schemeDark2)
            .domain(cities).range(RANDOM_COLORS);
        return d3.rgb(dotColor(d.city)).darker()
    }

    function getLocationDotTranslation(d, i) {
        d.x = Math.floor(i / dot_row);
        d.y = i % dot_row;
        return `translate(${d.x*dot_size},${(d.y)*dot_size})`;
    }

    function getLocationCount(data) {
        let locationCount = []
        data.forEach(datum => {
            if (!datum.hasOwnProperty('location') || datum.location.city == null) return
            if (locationCount.some(e => e.city === datum.location.city)) {
                locationCount.filter(e => e.city === datum.location.city)[0].count++;
            } else {
                datum.location.count = 1;
                locationCount.push(datum.location);
            }
        });
        locationCount.sort((a, b) => b.count - a.count)
        return locationCount;
    }

    function getLocationDots(data) {
        let locationDots = [];
        data.forEach(datum => {
            let count = datum.count;
            delete datum.count;
            for (let i = 0; i < count; i++)
                locationDots.push(datum);
        })
        return locationDots;
    }

    function getCities(data) {
        let cities = []
        data.forEach(e => cities.push(e.city))
        return cities
    }

    function getCountries(data) {
        let countries = []
        data.forEach(e => countries.push(e.country_name))
        return [...new Set(countries)]
    }
}

d3.json('./data/chrome_history_anonymous.json').then(gotData)