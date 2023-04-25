var width = 960;
var height = 600;

var svg = d3.select("#viz2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/cidades.geojson").then(function(data) {
  var projection = d3.geoMercator()
      .scale(5000)
      .center([-43.1729, -22.9068])
      .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

  svg.append("path")
      .datum(data)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "black");
});
