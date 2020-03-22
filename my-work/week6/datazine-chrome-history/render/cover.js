const COLOR = {
    "orange": '#E04838',
    "yellow": '#FFCA4A',
    "blue": '#3B8CF3',
    "violet": '#57068C',
    'gray': '#444444',
    'lightgray': '#D2D2D2'
}
COLOR.backgroundColor = COLOR.violet

const viz = d3.select('#container')
    .append('svg')
    .attr('id', 'viz')
    .style('width', '100%')
    .style('height', '100%')
    .style('background', COLOR.backgroundColor)

const w = 1200,
    h = 800;



function main(data) {
    var backgroundGradient = viz.append("defs")
        .append("linearGradient")
        .attr("id", "background-gradient")
        .attr("gradientTransform", "rotate(0)");
    backgroundGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", COLOR.violet);

    backgroundGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", COLOR.yellow);


    viz.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr("fill", "url(#background-gradient)")
    let downtext = viz.append('g')
        .attr('font-family', 'Gill Sans')
        .attr('fill', 'white')
        .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')


    downtext.append('text')
        .attr('font-size', 380)
        .text('5988')
        .attr('transform', 'translate(' + -150 + ',' + -127 + ')')

    downtext.append('text')
        .text('2')
        .attr('font-size', 450)
        .attr('transform', 'translate(' + -600 + ',' + 100 + ')')
    downtext.append('text')
        .text('9')
        .attr('font-size', 500)
        .attr('transform', 'translate(' + -400 + ',' + 300 + ')')
    downtext.append('text')
        .text('132')
        .attr('font-size', 400)
        .attr('transform', 'translate(' + 0 + ',' + 300 + ')')



    downtext.append('text')
        .text('RECORDS')
        .attr('font-size', 40)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + -220 + ',' + -350 + ')')

    downtext.append('text')
        .text('DAYS')
        .attr('font-size', 70)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + -450 + ',' + 300 + ')')

    downtext.append('text')
        .text('CONNECTED TO')
        .attr('font-size', 40)
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(' + 580 + ',' + -25 + ')')

    downtext.append('text')
        .text('CITIES')
        .attr('font-size', 60)
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(' + 580 + ',' + 370 + ')')

    var myimage = viz.append('image')
        .attr('xlink:href', '../images/chrome.png')
        .attr('width', w)
        .attr('height', h)

    let upText = viz.append('g')
        .attr('font-family', 'Gill Sans')
        .attr('fill', 'white')
        .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')


    upText.append('text')
        .text('a month')
        .attr('font-size', 60)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + 0 + ',' + -160 + ')')
    upText.append('text')
        .text('of')
        .attr('font-size', 60)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + -200 + ',' + 50 + ')')
    upText.append('text')
        .text('web')
        .attr('font-size', 60)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + -160 + ',' + 120 + ')')

    upText.append('text')
        .text('on')
        .attr('font-size', 60)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + 180 + ',' + 50 + ')')
    upText.append('text')
        .text('Chrome')
        .attr('font-size', 44)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + 155 + ',' + 120 + ')')

}

main()