var width = 960;
var height = 600;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("cidades.geojson").then(function(data) {
  var projection = d3.geoMercator()
      .scale(1000)
      .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

  svg.append("path")
      .data(data)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "black");
});
