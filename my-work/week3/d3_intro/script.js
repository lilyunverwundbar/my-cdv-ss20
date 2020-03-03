let viz = d3.select("#viz-container")
    .append("svg")
    .attr('id', 'viz')

let size = 35;
let h = window.innerHeight;

d3.json('data.json').then(data => {

    let floorCount = {}
    viz.selectAll('rect').data(data).enter()
        .append('rect')
        .attr('y', (d) => {
            if (d.roomNumber != 'N/A') {
                let floor = parseInt(d.roomNumber / 100);
                d.y = h - floor * size
                return d.y;
            } else {
                return -100;
            }
        })
        .attr('x', (d) => {
            let floor = parseInt(d.roomNumber / 100);
            if (floor in floorCount) {
                floorCount[floor].count += 1;
                if (floorCount[floor].lastDatetime != d.datetime) {
                    floorCount[floor].count += 0.5;
                }
                floorCount[floor].lastDatetime = d.datetime;
            } else {
                floorCount[floor] = {
                    count: 1,
                    lastDatetime: d.datetime
                };
            }
            d.x = floorCount[floor].count * size + 10
            return d.x;
        })
        .attr('width', size * 0.8)
        .attr('height', size * 0.8)
        .attr('fill', (d) => {
            return categoryToColor(d)
        })
        .attr('stroke', (d) => {
            return timesOfAppearanceToColor(d)
        })
        .attr('stroke-width', '2')
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    //text for floor numbers
    // viz.selectAll('text').data(d3.range(1, 17)).enter()
    //     .append('text')
    //     .attr('y', (floor) => {
    //         return h - (floor - 0.75) * size
    //     })
    //     .attr('x', '4')
    //     .attr("font-size", size + "px")
    //     .text((floor) => {
    //         return floor;
    //     })

})


function handleMouseOver(d, i) { // Add interactivity

    let text = viz.append("text")
        .attr('id', () => {
            return "t" + i
        })
        .attr('x', size)
        .attr('y', size)
    text.append('tspan')
        .attr('x', size)
        .attr('y', size)
        .text(() => {
            return `This is the ${d.categoryOfContent} on shelf on ${d3.timeFormat("%B %d at %I:%M %p")(new Date(d.datetime))}`
        })
    text.append('tspan')
        .attr('x', size)
        .attr('y', 2 * size)
        .text(() => {
            return `Package Serial ${d.packageNumber} delivered by ${d.deliveryCompany}`
        })
    text.append('tspan')
        .attr('x', size)
        .attr('y', 3 * size)
        .text(() => {
            return `Sent from ${d.sirnameOfSender} in ${d.fromCity}, ${d.fromProvince}`
        })
    text.append('tspan')
        .attr('x', size)
        .attr('y', 4 * size)
        .text(() => {
            return `Sent to ${d.sirnameOfReceiver} living in Floor ${parseInt(d.roomNumber / 100)} of Building #${d.buildingNumber} in my neighborhood`
        })
    text.append('tspan')
        .attr('x', size)
        .attr('y', 5 * size)
        .text(() => {
            return `I have seen it on shelf for ${d.timesOfAppearance} time(s) as the border color shows`
        })


}

function handleMouseOut(d, i) {
    d3.select("#t" + i).remove(); // Remove text location
}

function categoryToColor(d) {
    let category = d.categoryOfContent;
    switch (category) {
        case 'Art Supply':
            return '#FF5C5A' //medium light red
        case 'Book':
            return '#616138' //dark yellow-green
        case 'Clothes':
            return '#4E4F97' //blue
        case 'Cosmetic Product':
            return '#8E354A' //dark pink-red
        case 'Educational Material':
            return '#616138' //dark yellow-green
        case 'Electrical Appliance':
            return "#FBE251" //yellow
        case 'Food':
            return '#F05E1C' //bright red
        case 'Household Product':
            return '#B17844' //light orange
        case 'Sanitary Product':
            return '#0089A7' //bright blue
        default:
            return "#050505"
    }
}

function timesOfAppearanceToColor(d) {
    let times = d.timesOfAppearance;
    switch (times) {
        case 1:
            return categoryToColor(d)
        case 2:
            return '#B2B2B2'
        case 3:
            return "#666666"
        case 4:
            return '#333333'
        default:
            return '#000000'

    }
}