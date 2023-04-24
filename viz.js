var width = 500
var height = 500

var svg1 = d3.select("#viz")
	.append("svg")
    .attr("width", width)
    .attr("height", height);
	
// Map and projection
var projection = d3.geoNaturalEarth1()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2]);

// Load external data and boot
d3.json("cidades.geojson", function(data){

    // Draw the map
    svg1.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
})






const data2 = [10, 20, 30, 40, 50];

const svg2 = d3.select("#viz2")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

const pie2 = d3.pie()(data2);

const arc2 = d3.arc()
  .innerRadius(0)
  .outerRadius(200);

const colors2 = d3.scaleOrdinal()
  .range(d3.schemeCategory10);

const arcs2 = svg2.selectAll("g.arc")
  .data(pie2)
  .enter()
  .append("g")
  .attr("class", "arc")
  .attr("transform", "translate(250, 250)");

arcs2.append("path")
  .attr("fill", (d, i) => colors2(i))
  .attr("d", arc2);




