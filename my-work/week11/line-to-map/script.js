let w = 1200;
let h = 800;
let padding = 90

// SVG
let viz = d3.select("#container").append("svg")
  .style("width", w)
  .style("height", h)
  .style("background-color", "black")


// IMPORT DATA
d3.json("mainland.geojson").then(function (geoData) {
  d3.json("countries.geojson").then(function (countriesGeoData) {

    d3.csv('china-pop-2018.csv').then(function (popData) {
      // PRINT DATA
      console.log(geoData);
      popData = popData.map(d => {
        d.population = Number(d.population);
        return d
      })
      let minPop = d3.min(popData, d => d.population)
      let maxPop = d3.max(popData, d => d.population)
      console.log(minPop, maxPop)
      let colorScale = d3.scaleLinear().domain([minPop, maxPop]).range(['white', 'black']);


      let projection = d3.geoMercator()
        .translate([w / 2, h / 2])
        .fitExtent([
          [padding, padding],
          [w - padding, h - padding]
        ], geoData)
      console.log(projection.scale())

      let pathMaker = d3.geoPath(projection);


      // viz.selectAll(".graticule").data(d3.geoGraticule().lines()).enter()
      //   .append("path")
      //   .attr("class", "graticule")
      //   .attr("d", pathMaker)
      //   .attr("stroke", "black")
      //   .attr("stroke-width", 1)

      viz.selectAll(".country").data(countriesGeoData.features).enter()
        .append("path")
        .attr("class", "country")
        .attr("d", pathMaker)
        .attr("fill", 'black')
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr('opacity', 0)


      viz.selectAll(".province").data(geoData.features).enter()
        .append("path")
        .attr("class", "province")
        .attr("d", pathMaker)
        .attr("fill", d => {
          popDatum = popData.find(pd => pd.province == d.properties.name);
          if (popDatum) return colorScale(popDatum.population)
          else return 'black'
        })
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on('mouseover', handleMouseOverProvince)
        .on('mouseout', handleMouseOutProvince)


      function handleMouseOverProvince() {
        d3.select(this).transition().attr('fill', 'red')
      }

      function handleMouseOutProvince() {
        d3.select(this).transition().attr("fill", d => {
          popDatum = popData.find(pd => pd.province == d.properties.name);
          if (popDatum) return colorScale(popDatum.population)
          else return 'black'
        })
      }

      // coordinate of Tiananmen Square
      let lat = 39.9055;
      let lon = 116.3976;
      var symbolGenerator = d3.symbol()
        .type(d3.symbolStar)
        .size(100);

      var pathData = symbolGenerator();
      viz.append('path')
        .attr('class', 'tiananmen')
        .attr("transform", "translate(" + projection([lon, lat])[0] + ", " + projection([lon, lat])[1] + ")")
        .attr('d', pathData)
        .attr('fill', 'red')
        .on('mouseover', handleMouseOverSchool)
        .on('mouseout', handleMouseOutSchool)

      function handleMouseOverSchool() {
        var symbolGenerator = d3.symbol()
          .type(d3.symbolStar)
          .size(2000);
        var pathData = symbolGenerator();
        d3.select(this).transition().attr('d', pathData);
      }

      function handleMouseOutSchool() {
        var symbolGenerator = d3.symbol()
          .type(d3.symbolStar)
          .size(100);
        var pathData = symbolGenerator();
        d3.select(this).transition().attr('d', pathData);

      }

      // Add button interaction
      let project_index = 1;
      let projectionMethods = [d3.geoMercator(), d3.geoEqualEarth(), d3.geoAzimuthalEqualArea(), d3.geoTransverseMercator(), d3.geoNaturalEarth1(), d3.geoEquirectangular(), d3.geoConicEquidistant(), d3.geoConicEqualArea(), d3.geoConicConformal()]
      let projectionNames = ['Mercator', 'Equal Earth', 'Azimuthal Equal Area', 'Transverse Mercator', 'Natural Earth', 'Equirectangular', 'Conic Equidisitant', 'Conic Equal Area', 'Conic Conformal']
      let roo = 0;
      d3.select('#button').on('click', () => {
        // roo += 10;
        let temp = Math.floor(Math.random() * projectionMethods.length)
        while (temp == project_index) {
          temp = Math.floor(Math.random() * projectionMethods.length)
        }
        project_index = temp
        projection = projectionMethods[project_index]
          .translate([w / 2, h / 2])
          .rotate([roo, 0, 0])
          .fitExtent([
            [padding, padding],
            [w - padding, h - padding]
          ], geoData)
        pathMaker = d3.geoPath(projection)

        d3.select('#text').html(projectionNames[project_index])
        viz.selectAll(".country")
          .transition()
          .duration(700)
          .ease(d3.easeBackInOut)
          .attr('d', pathMaker)

        // viz.selectAll(".graticule")
        //   .transition()
        //   .duration(700)
        //   .ease(d3.easeBackInOut)
        //   .attr('d', pathMaker)

        viz.selectAll(".province")
          .transition()
          .duration(700)
          .ease(d3.easeBackInOut)
          .attr('d', pathMaker)

        let lat = 39.9055;
        let lon = 116.3976;

        viz.selectAll('.tiananmen')
          .transition()
          .attr('fill', 'orange')
          .transition()
          .duration(1500)
          .ease(d3.easeElasticOut)
          .attr("transform", "translate(" + projection([lon, lat])[0] + ", " + projection([lon, lat])[1] + ")")
          .transition()
          .attr('fill', 'red')

      })

      d3.select('#checkbox').on('click', () => {
        if (d3.select('#checkbox').property('checked')) {
          viz.selectAll('.country')
            .transition()
            .attr('opacity', 1)
          viz
            .transition()
            .style("background-color", "white")

        } else {
          viz.selectAll('.country')
            .transition()
            .attr('opacity', 0)
          viz
            .transition()
            .style("background-color", "black")
        }
      })

    })

  })
})