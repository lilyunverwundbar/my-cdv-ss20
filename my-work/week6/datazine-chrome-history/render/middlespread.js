const COLOR = {
    "orange": '#E04838',
    "yellow": '#FFCA4A',
    "blue": '#3B8CF3',
    "violet": '#57068C',
    'gray': '#444444',
    'lightgray': '#D2D2D2'
}

COLOR.textColor = '#222222'
COLOR.backgroundColor = "white"

const viz = d3.select('#container')
    .append('svg')
    .attr('id', 'viz')
    .style('width', '100%')
    .style('height', '100%')
    .style('background', COLOR.backgroundColor)


const w = 1200,
    h = 800;
const weekdayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dateFormat = d3.timeFormat('%Y-%m-%d');
const hourFormat = d3.timeFormat('%H');




function gotData(data) {
    initCalendar(data);
    initClock(data);
    // initDots(data);
}

function initCalendar(data) {
    const calendarOffset = [130, 120];
    const cellSize = 100;

    let dateCountData = getDateCount(data);

    let calendarSection = viz.append('g')
        .attr('id', 'calendarSection')
        .attr('transform', 'translate(' + calendarOffset[0] + ',' + calendarOffset[1] + ')')
        .attr('text-anchor', 'middle')
        .attr('fill', COLOR.orange)
        .attr('font-family', 'Gill Sans');

    let calendarLegendGroup = calendarSection.append('g')
        .attr('transform', 'translate(' + -cellSize * 0.2 + ',' + -cellSize * 0.2 + ')')

    calendarLegendGroup.append('text')
        .text('February 2020')
        .attr('font-size', '50')
        .attr('text-anchor', 'start')

    let weekdayElements = calendarSection.selectAll('.weekday').data(weekdayStrings)
        .enter()
        .append('g')
        .attr('class', 'weekday')
        .attr('transform', (d, i) => `translate(${i*cellSize},30)`);

    let weekdayText = weekdayElements.append('text')
        .text(d => d);


    // get the range of visit count
    let maxCount = 0,
        minCount = 100;
    dateCountData.forEach(e => {
        maxCount = Math.max(e.count, maxCount);
        minCount = Math.min(e.count, minCount);
    });



    // create a size scale
    let sizeFn = d3.scaleSqrt()
        .domain([minCount, maxCount])
        .range([10, cellSize * 0.8]);

    // calendar date count elements
    let dateCountElements = calendarSection.selectAll('.dateCount').data(dateCountData)
        .enter()
        .append('g')
        .attr('class', 'dateCount')
        .attr('transform', getDateCountTranslation);

    // dateCountShape
    let dateCountShape = dateCountElements.append('circle')
        .attr('r', d => sizeFn(d.count))
        .attr('fill', getDateCountShapeColor)
        .attr('fill-opacity', '0.85')



    // dateCountText 
    let dateCountText = dateCountElements.append('text')
        .text(d => d.date.getDate())
        .attr('transform', 'translate(' + 0 + ',' + 5 + ')')
        .attr('fill', (d, i) => {
            if (i > 15) return '#ffffff'
            else return COLOR.textColor
        })


    let calengerLegend = calendarLegendGroup.append('g')
        .attr('transform', 'translate(' + (7 * 100 - 20) + ',' + 630 + ')')
        .attr('fill', COLOR.violet)
        .attr('fill-opacity', 0.7)
        .attr('text-anchor', 'end')


    calengerLegend.append('text')
        .text("Feb 17 was my first day of school.")


    calengerLegend.append('text')
        .text("I seemed to browse more after then.")
        .attr('x', 0)
        .attr('y', 20)


    function getDateCount(data) {
        //create an array of all the date in Feb 2020
        let dateCount = d3.scaleTime()
            .domain([new Date(2020, 1, 1), new Date(2020, 1, 29)])
            .ticks(d3.timeDay, 1)
            .map(d => {
                return {
                    'date': d,
                    'count': 0
                }
            });

        //fill in the date count data
        data.forEach(datum => {
            let date = new Date(datum.lastVisitTimeUTC);
            dateCount.forEach(d => {
                //count when the date is the same
                if (dateFormat(d.date) === dateFormat(date))
                    d.count++;
            })
        });

        return dateCount;
    }

    function getDateCountTranslation(d, i) {
        let x = d.date.getDay();
        let y = Math.floor((d.date.getDate() + 5) / 7); // 5 is the weekday number of Feb 1st
        return `translate(${x*cellSize},${(y+1)*cellSize})`;
    }

    function getDateCountShapeColor(d, i) {
        let colorFn = d3.scaleLinear().domain([minCount - 100, maxCount])
            .interpolate(d3.interpolateHcl);
        if (i < 16) {
            // color gradient for before school
            colorFn.range([d3.rgb(COLOR.orange), d3.rgb(COLOR.yellow)]);
            return colorFn(d.count);
        } else {
            // color gradient for after school
            colorFn.range([d3.rgb(COLOR.orange), d3.rgb(COLOR.violet)]);
            return colorFn(d.count);
        }
    }
}


function initClock(data) {
    const size = 900,
        innerRadius = size / 5,
        outerRadius = size / 2;

    let hourCountData = getHourCount(data);

    let clockSection = viz.append('g')
        .attr('id', 'clockSection')
        .attr('transform', 'translate(' + w + ',' + (h / 2 + 20) + ')')
        .attr('text-anchor', 'middle')
        .attr('fill', "#ffffff")
        .attr('font-family', 'Gill Sans');


    let extent = d3.extent(hourCountData, d => d.count);

    let x = d3.scaleLinear()
        .domain([0, 23])
        .range([0, 2 * Math.PI])
    let y = d3.scaleLinear()
        .domain(extent)
        .range([innerRadius, outerRadius])


    let area = d3.areaRadial()
        .curve(d3.curveCardinalClosed.tension(0))
        .angle((d, i) => x(i))
        .innerRadius((d) => 0)
        .outerRadius((d) => y(d.count))


    var radialGradient = clockSection.append("defs")
        .append("linearGradient")
        .attr("id", "radial-gradient")
        .attr("gradientTransform", "rotate(80)");

    radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", COLOR.violet);

    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", COLOR.yellow);

    clockSection.append("path")
        .attr("fill", "url(#radial-gradient)")
        .attr("fill-opacity", 1)
        .attr("d", area(hourCountData));
    clockSection.append('circle')
        .attr('r', innerRadius)
        .attr('fill', COLOR.lightgray)
        .attr('fill-opacity', 0.2)
    clockSection.selectAll('.hour-label')
        .data(d3.range(0, 24, 3))
        .enter()
        .append('text')
        .attr('class', 'hour-label')
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('fill', d => {
            if (d > 15 || d < 6) return 'black'
            else return 'white'
        })
        .attr('x', function (d) {
            return innerRadius * 0.8 * Math.sin(d / 24 * Math.PI * 2);
        })
        .attr('y', function (d) {
            return -innerRadius * 0.8 * Math.cos(d / 24 * Math.PI * 2) + 8;
        })
        .text(function (d) {
            return d;
        });

    clockSection.selectAll('.hour-tick')
        .data(d3.range(0, 24))
        .enter()
        .append('line')
        .attr('stroke', (d, i) => {
            if (i >= 18 || i < 6) return COLOR.yellow
            else return COLOR.violet
        })
        .attr('opacity', 0.5)
        .attr('stroke-width', 8)
        .attr('class', 'hour-tick')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', innerRadius)
        .attr('y2', innerRadius - 20)
        .attr('transform', function (d) {
            return 'rotate(' + (d * 15) + ')';
        });


    function getHourCount(data) {
        //create an array of all the hour numbers in a day
        let hourCount = d3.range(0, 24)
            .map(d => {
                return {
                    'hour': d.toString(),
                    'count': 0
                }
            });

        // fill in the hour count data
        data.forEach(datum => {
            let date = new Date(datum.lastVisitTimeUTC);
            hourCount.forEach(d => {
                //count when the date is the same
                if (parseInt(d.hour) === parseInt(hourFormat(date)))
                    d.count++;
            })
        });

        return hourCount;
    }
}

function initWordCloud(wordcountData) {
    wordcountData = wordcountData.slice(0, -1)
    let length;
    let wordCloudSection = viz.append('g')
        .attr('id', 'wordCloudSection')
        .attr('transform', 'translate(' + w * 1.5 + ',' + h / 2 + ')')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Gill Sans')


    d3.layout.cloud().size([1200, 800])
        .words(wordcountData)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => d.count)
        .on('end', draw)
        .start();

    function draw(words) {
        length = words.length;
        wordCloudSection.selectAll('text')
            .data(words)
            .enter().append('text')
            .attr('class', 'word')
            .attr('fill', getWordColor)
            .attr('fill-opacity', getWordOpacity)
            .attr('font-size', d => Math.min(d.count, 200))
            .attr('text-anchor', 'middle')
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.word);
    }

    // wordCloudSection.append('text')
    //     .text('HI')
    //     .attr('font-size', 400)
    //     .attr('y', 100)

    function getWordOpacity(d, i) {
        let opacityScale = d3.scaleLinear().domain([0, 400])
            .range([1, 0])
        return opacityScale(d.count)
    }

    function getWordColor(d, i) {
        let colorFn = d3.scaleOrdinal(d3.schemeDark2)
            .domain(wordcountData.map(e => e.word))
        return colorFn(d.word);
    }
    d3.json('./data/chrome_history_anonymous.json').then(gotData)


}


d3.json('./data/chrome_history_wordcount.json').then(initWordCloud)