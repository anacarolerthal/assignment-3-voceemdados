var width = 960;
var height = 600;

var svg = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/cidades.geojson").then(function(data) {
  var projection = d3.geoMercator()
      .scale(7400)
      .center([-43.1729, -22.9068])
      .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

  svg.append("path")
      .datum(data)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "white");
});





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




